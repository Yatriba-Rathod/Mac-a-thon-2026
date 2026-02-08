"use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { useParkingStore } from "@/lib/store"
// //import { getSignedUploadUrl, uploadFileToSignedUrl } from "@/lib/api"
// import {
//   Globe,
//   Radio,
//   Upload,
//   CheckCircle2,  
//   AlertCircle,
//   Loader2,
//   Save,
//   Video,
// } from "lucide-react"

export function SettingsPanel() {
  // const { state, dispatch } = useParkingStore()

  // const [wsUrl, setWsUrl] = useState(state.settings.wsUrl)
  // const [saved, setSaved] = useState(false)
  // const [wsError, setWsError] = useState("")

  // // Video upload
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [uploading, setUploading] = useState(false)
  // const [uploadStatus, setUploadStatus] = useState<
  //   "idle" | "success" | "error"
  // >("idle")
  // const [uploadMessage, setUploadMessage] = useState("")
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // const validate = () => {
  //   if (wsUrl && !wsUrl.startsWith("ws")) {
  //     setWsError("Must start with ws:// or wss://")
  //     return false
  //   }
  //   setWsError("")
  //   return true
  // }

  // const handleSave = () => {
  //   if (!validate()) return

  //   const settings = { restBaseUrl: state.settings.restBaseUrl, wsUrl: wsUrl }
  //   dispatch({ type: "SET_SETTINGS", settings })
  //   localStorage.setItem("parking-settings", JSON.stringify(settings))

  //   setSaved(true)
  //   setTimeout(() => setSaved(false), 2000)
  // }

  // const handleUpload = async () => {
  //   if (!selectedFile || !state.settings.restBaseUrl) return

  //   setUploading(true)
  //   setUploadStatus("idle")
  //   try {
  //     // const { url } = await getSignedUploadUrl(
  //     //   state.settings.restBaseUrl,
  //     //   selectedFile.name,
  //     //   selectedFile.type
  //     // )
  //     //await uploadFileToSignedUrl(url, selectedFile)
  //     setUploadStatus("success")
  //     setUploadMessage("Video uploaded successfully!")
  //   } catch (err) {
  //     setUploadStatus("error")
  //     setUploadMessage(
  //       err instanceof Error ? err.message : "Upload failed"
  //     )
  //   } finally {
  //     setUploading(false)
  //   }
  // }

  // return (
  //   <div className="flex flex-1 overflow-hidden">
  //     <main className="mx-auto w-full max-w-2xl overflow-y-auto p-8">
  //       <h1 className="text-xl font-semibold text-foreground">Settings</h1>
  //       <p className="mt-1 text-sm text-muted-foreground">
  //         Configure connection and video upload for the parking system.
  //       </p>

  //       {/* Connection settings */}
  //       <div className="mt-8 space-y-6">
  //         <div className="rounded-lg border border-border bg-card p-6">
  //           <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
  //             <Globe className="h-4 w-4 text-primary" />
  //             Connection
  //           </h2>

  //           <div className="mt-4 space-y-4">
  //             <div>
  //               <label
  //                 htmlFor="ws-url"
  //                 className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
  //               >
  //                 <Radio className="h-3 w-3" />
  //                 WebSocket URL
  //               </label>
  //               <Input
  //                 id="ws-url"
  //                 value={wsUrl}
  //                 onChange={(e) => setWsUrl(e.target.value)}
  //                 placeholder="wss://your-backend-url/ws"
  //                 className="bg-muted font-mono text-sm text-foreground"
  //               />
  //               {wsError && (
  //                 <p className="mt-1 text-xs text-[hsl(var(--spot-occupied))]">
  //                   {wsError}
  //                 </p>
  //               )}
  //             </div>

  //             <Button onClick={handleSave} className="gap-1.5">
  //               {saved ? (
  //                 <CheckCircle2 className="h-4 w-4" />
  //               ) : (
  //                 <Save className="h-4 w-4" />
  //               )}
  //               {saved ? "Saved!" : "Save Settings"}
  //             </Button>
  //           </div>
  //         </div>

  //         {/* Video upload */}
  //         <div className="rounded-lg border border-border bg-card p-6">
  //           <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
  //             <Video className="h-4 w-4 text-primary" />
  //             Upload Video to GCS
  //           </h2>
  //           <p className="mt-1 text-xs text-muted-foreground">
  //             Upload an MP4 file via a backend-generated signed URL.
  //           </p>

  //           {!state.settings.restBaseUrl && (
  //             <div className="mt-4 flex items-center gap-2 rounded-md border border-[hsl(45,90%,55%)]/30 bg-[hsl(45,90%,55%)]/5 px-3 py-2">
  //               <AlertCircle className="h-4 w-4 text-[hsl(45,90%,55%)]" />
  //               <p className="text-xs text-[hsl(45,90%,55%)]">
  //                 Configure the REST Base URL first to enable video upload.
  //               </p>
  //             </div>
  //           )}

  //           <div className="mt-4 space-y-3">
  //             <div>
  //               <input
  //                 ref={fileInputRef}
  //                 type="file"
  //                 accept="video/mp4"
  //                 onChange={(e) => {
  //                   setSelectedFile(e.target.files?.[0] ?? null)
  //                   setUploadStatus("idle")
  //                 }}
  //                 className="sr-only"
  //                 id="video-upload"
  //               />
  //               <Button
  //                 variant="outline"
  //                 onClick={() => fileInputRef.current?.click()}
  //                 className="gap-1.5 bg-transparent"
  //               >
  //                 <Upload className="h-3.5 w-3.5" />
  //                 {selectedFile ? selectedFile.name : "Select MP4 File"}
  //               </Button>
  //             </div>

  //             {selectedFile && (
  //               <div className="flex items-center gap-2">
  //                 <Badge variant="outline" className="font-mono text-xs">
  //                   {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
  //                 </Badge>
  //               </div>
  //             )}

  //             <Button
  //               onClick={handleUpload}
  //               disabled={
  //                 !selectedFile || !state.settings.restBaseUrl || uploading
  //               }
  //               className="gap-1.5"
  //             >
  //               {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
  //               {uploading ? "Uploading..." : "Upload via Signed URL"}
  //             </Button>

  //             {uploadStatus !== "idle" && (
  //               <div
  //                 className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs ${uploadStatus === "success"
  //                     ? "border border-[hsl(var(--spot-empty))]/30 bg-[hsl(var(--spot-empty))]/10 text-[hsl(var(--spot-empty))]"
  //                     : "border border-[hsl(var(--spot-occupied))]/30 bg-[hsl(var(--spot-occupied))]/10 text-[hsl(var(--spot-occupied))]"
  //                   }`}
  //               >
  //                 {uploadStatus === "success" ? (
  //                   <CheckCircle2 className="h-3.5 w-3.5" />
  //                 ) : (
  //                   <AlertCircle className="h-3.5 w-3.5" />
  //                 )}
  //                 {uploadMessage}
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // )
}
