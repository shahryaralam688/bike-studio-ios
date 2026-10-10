import QuickLook
import SwiftUI
import WebKit

struct ThreeJSWebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let userContent = WKUserContentController()
        userContent.add(context.coordinator, name: "openUSDZ")

        let config = WKWebViewConfiguration()
        config.userContentController = userContent
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        config.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        config.defaultWebpagePreferences.allowsContentJavaScript = true
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let handler = LocalWebSchemeHandler(rootDirectory: Self.webRoot)
        config.setURLSchemeHandler(handler, forURLScheme: LocalWebSchemeHandler.scheme)
        context.coordinator.schemeHandler = handler

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.933, green: 0.933, blue: 0.933, alpha: 1) // #eee
        webView.scrollView.backgroundColor = webView.backgroundColor
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.bouncesZoom = false
        webView.scrollView.maximumZoomScale = 1
        webView.scrollView.minimumZoomScale = 1
        webView.scrollView.delaysContentTouches = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = false
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        webView.scrollView.panGestureRecognizer.isEnabled = false
        for recognizer in webView.scrollView.gestureRecognizers ?? [] {
            if recognizer is UIPinchGestureRecognizer {
                recognizer.isEnabled = false
            }
        }
        #if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        #endif

        context.coordinator.webView = webView

        let url = URL(string: "\(LocalWebSchemeHandler.scheme)://local/index.html")!
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    private static var webRoot: URL {
        guard let url = Bundle.main.resourceURL?.appendingPathComponent("WebContent", isDirectory: true) else {
            fatalError("WebContent folder missing from app bundle")
        }
        return url
    }

    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, QLPreviewControllerDataSource {
        var schemeHandler: LocalWebSchemeHandler?
        weak var webView: WKWebView?
        private var previewURL: URL?
        private var transfers: [String: (filename: String, total: Int, chunks: [Int: String])] = [:]

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "openUSDZ",
                  let body = message.body as? [String: Any],
                  let type = body["type"] as? String,
                  let transferId = body["transferId"] as? String else {
                return
            }

            switch type {
            case "begin":
                let filename = (body["filename"] as? String) ?? "asset.usdz"
                let total = body["total"] as? Int ?? 0
                transfers[transferId] = (filename, total, [:])

            case "chunk":
                guard var transfer = transfers[transferId],
                      let index = body["index"] as? Int,
                      let data = body["data"] as? String else { return }
                transfer.chunks[index] = data
                transfers[transferId] = transfer

            case "end":
                guard let transfer = transfers.removeValue(forKey: transferId) else { return }
                var base64 = ""
                for index in 0 ..< transfer.total {
                    guard let part = transfer.chunks[index] else {
                        print("USDZ transfer missing chunk \(index)")
                        return
                    }
                    base64 += part
                }
                guard let data = Data(base64Encoded: base64) else {
                    print("USDZ base64 decode failed")
                    return
                }
                let url = FileManager.default.temporaryDirectory.appendingPathComponent(transfer.filename)
                do {
                    try data.write(to: url, options: .atomic)
                    previewURL = url
                    presentQuickLook()
                } catch {
                    print("Failed to write USDZ: \(error)")
                }

            default:
                break
            }
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url, url.pathExtension.lowercased() == "usdz" {
                previewURL = url
                presentQuickLook()
                decisionHandler(.cancel)
                return
            }
            decisionHandler(.allow)
        }

        private func presentQuickLook() {
            guard previewURL != nil,
                  let presenter = webView?.window?.rootViewController ?? topViewController() else {
                return
            }

            let preview = QLPreviewController()
            preview.dataSource = self
            presenter.present(preview, animated: true)
        }

        private func topViewController(base: UIViewController? = nil) -> UIViewController? {
            let base = base ?? UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first { $0.isKeyWindow }?
                .rootViewController

            if let nav = base as? UINavigationController {
                return topViewController(base: nav.visibleViewController)
            }
            if let tab = base as? UITabBarController {
                return topViewController(base: tab.selectedViewController)
            }
            if let presented = base?.presentedViewController {
                return topViewController(base: presented)
            }
            return base
        }

        func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
            previewURL == nil ? 0 : 1
        }

        func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
            (previewURL as QLPreviewItem?) ?? URL(fileURLWithPath: "/dev/null") as QLPreviewItem
        }
    }
}

final class LocalWebSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "appcontent"

    private let rootDirectory: URL
    private let queue = DispatchQueue(label: "LocalWebSchemeHandler")

    init(rootDirectory: URL) {
        self.rootDirectory = rootDirectory.standardizedFileURL
    }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        queue.async { [rootDirectory] in
            guard let requestURL = urlSchemeTask.request.url else {
                urlSchemeTask.didFailWithError(URLError(.badURL))
                return
            }

            var relativePath = requestURL.path
            if relativePath.hasPrefix("/") {
                relativePath.removeFirst()
            }
            if relativePath.isEmpty {
                relativePath = "index.html"
            }

            let fileURL = rootDirectory.appendingPathComponent(relativePath).standardizedFileURL
            guard fileURL.path.hasPrefix(rootDirectory.path) else {
                urlSchemeTask.didFailWithError(URLError(.noPermissionsToReadFile))
                return
            }

            do {
                let data = try Data(contentsOf: fileURL)
                let mime = Self.mimeType(for: fileURL.pathExtension)
                let encoding = mime.hasPrefix("text/") || mime.contains("javascript") || mime == "application/json" ? "utf-8" : nil
                // Prefer HTTPURLResponse so WKWebView gets explicit Content-Type for ES modules / WASM.
                let response = HTTPURLResponse(
                    url: requestURL,
                    statusCode: 200,
                    httpVersion: "HTTP/1.1",
                    headerFields: [
                        "Content-Type": encoding != nil ? "\(mime); charset=utf-8" : mime,
                        "Content-Length": "\(data.count)",
                        "Access-Control-Allow-Origin": "*"
                    ]
                )!
                urlSchemeTask.didReceive(response)
                urlSchemeTask.didReceive(data)
                urlSchemeTask.didFinish()
            } catch {
                urlSchemeTask.didFailWithError(error)
            }
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private static func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "html", "htm": return "text/html"
        case "js", "mjs": return "text/javascript"
        case "css": return "text/css"
        case "json": return "application/json"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "webp": return "image/webp"
        case "svg": return "image/svg+xml"
        case "glb": return "model/gltf-binary"
        case "gltf": return "model/gltf+json"
        case "usdz": return "model/vnd.usdz+zip"
        case "wasm": return "application/wasm"
        case "bin": return "application/octet-stream"
        case "woff": return "font/woff"
        case "woff2": return "font/woff2"
        default: return "application/octet-stream"
        }
    }
}
