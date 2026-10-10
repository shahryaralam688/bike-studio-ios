# Bike Studio

iOS app for configuring a carbon-frame mountain bike in 3D, then exporting the result as USDZ for AR Quick Look.

This started as a study of the official three.js USDZ exporter demo and grew into a full mobile configurator: part isolation, live color try-on, neumorphic UI, and a native bridge that hands the finished bike to ARKit without showing the exploded animation pose.

## Demo video

See [`Demo/BikeStudio_joined_2x.mp4`](Demo/BikeStudio_joined_2x.mp4) — simulator walkthrough of customization + AR, joined and played at 2x.

## What the app does

1. Loads a textured carbon MTB (glTF) inside a `WKWebView` using three.js r180.
2. Lets you orbit / pinch the full bike on a soft studio background.
3. Tap any mesh to open a part card (material notes, care, weight).
4. Open **Customize** for a catalog of assemblies (frame, rims, tires, brakes, cockpit, drivetrain…).
5. Each row shows a real 3D thumbnail of that part, not a flat icon.
6. Pick a finish; color updates live on the isolated preview and on the bike. **OK** commits, **Back** reverts.
7. Front and back rims are independent (shared GLB materials get uniquified per node).
8. **View in AR** freezes the bike in the assembled bind pose, rebuilds USDZ, and opens Quick Look. Exploded animation never goes into AR.

## Stack

| Layer | Choice |
|--------|--------|
| Shell | SwiftUI, `WKWebView`, custom `appcontent://` scheme |
| Project | XcodeGen (`project.yml`) |
| 3D | three.js r180 — `GLTFLoader`, `OrbitControls`, `RoomEnvironment`, `USDZExporter` |
| Asset | `CarbonFrameBike.glb` (pre-decoded; no Draco / KTX2 WASM in the app) |
| AR | Chunked base64 → temp `.usdz` → `QLPreviewController` |
| UI | Offline HTML/CSS/JS, neumorphic sheet (soft raised / inset surfaces) |

## Why a pre-decoded GLB

The stock three.js bike ships with Draco + Basis/KTX2. On iOS Simulator and many devices those WASM workers tear down `com.apple.WebKit.GPU`. Early builds failed that way more than once.

Pipeline that stuck:

1. Strip / decode the compressed source offline.
2. Bake textures to ordinary JPEG/PNG maps Chrome could resolve.
3. Ship only `CarbonFrameBike.glb` in the bundle (plus a smaller `.compressed.glb` kept for tooling).

Console noise about `com.apple.WebKit.Networking` still appears; it is unrelated to load success.

## 3D model work (step by step)

1. **Source scene** — Carbon Frame Bike from the three.js misc_exporter_usdz example (Sketchfab credit: prefrontal cortex). Full hierarchy under `Bike` → `Rahmen` → wheels, fork, cockpit, drivetrain.
2. **Node map** — Walked the GLB (762 nodes) and locked a curated library of assemblies: `RobertS2016_Rahmen_Hauptrahmen`, front/rear `Felge_*`, `Reifen_*`, hubs, spokes, Hope rotors, Magura calipers, Federgabel, Cane Creek shock, Lenker, pedals, cassette, etc.
3. **Front / rear resolve** — Felge and Reifen pairs are sorted by world-axis span so “Front Rim” and “Back Rim” match the bike, not hard-coded guesswork that breaks if the asset is rotated.
4. **Isolation preview** — `PartPreview` clones meshes into a secondary scene that shares the main WebGL context and the same IBL environment (a second `WebGLRenderer` was unreliable in WKWebView). Thumbs are rendered to an offscreen canvas via `WebGLRenderTarget` → 2D readback.
5. **Color** — Finish palettes per family (carbon / rim metal / rubber / accents). Pending color is live; commit writes materials under that node only. Base colors are snapshotted so **Original** restores the factory look.
6. **Framing** — Main camera fits the full bike including explode extremes for in-app viewing; USDZ export always resets the mixer to time `0` (assembled) and omits animation tracks.
7. **UI** — Bottom sheet catalog grouped Frame / Wheels / Brakes / Suspension / Cockpit / Drivetrain. Detail view: inset 3D stage, live before→after chips, circular finish swatches. Visual language follows a soft neumorphic kit (light grey field, dual soft shadows, pill CTAs, blue primary).

## Open in Xcode

```bash
cd ThreeJSUSDZExporter
# if you edit project.yml:
xcodegen generate
open ThreeJSUSDZExporter.xcodeproj
```

Pick an iPhone simulator or device, then Run. After the model loads, use **Customize** and **View in AR**.

## Layout

```
ThreeJSUSDZExporter/
├── Demo/
│   └── BikeStudio_joined_2x.mp4
├── ThreeJSUSDZExporter/          # SwiftUI app + WKWebView bridge
├── WebContent/
│   ├── index.html                # Scene, configurator, PartPreview
│   ├── configurator.css
│   ├── part-details.js
│   ├── build/                    # three.module.js (r180)
│   ├── jsm/                      # controls, loaders, USDZExporter
│   ├── models/gltf/
│   │   ├── CarbonFrameBike.glb
│   │   └── CarbonFrameBike.compressed.glb
│   └── files/
├── project.yml
└── README.md
```

## Credits

- three.js [misc_exporter_usdz](https://threejs.org/examples/#misc_exporter_usdz)
- Carbon Frame Bike — [prefrontal cortex](https://sketchfab.com/prefrontalcortex) on Sketchfab
- Apple AR Quick Look / USDZ for on-device preview
