import fs from "fs"
import path from "path"

// Path to your admin folder
const baseDir = path.join(process.cwd(), "admin/sales")

// Recursively walk through all subfolders
function createPageFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let hasSubdirs = false

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      hasSubdirs = true
      createPageFiles(fullPath)
    }
  }

  // Create page.tsx if not exists
  const pageFile = path.join(dir, "page.tsx")
  if (!fs.existsSync(pageFile)) {
    const relativePath = path.relative(baseDir, dir)
    const title = relativePath === "" ? "Dashboard" : relativePath.replace(/\\/g, " / ")
    const content = `export default function Page() {
  return (
    <div className="p-6 text-xl font-semibold">
      ${title.charAt(0).toUpperCase() + title.slice(1)} Page
    </div>
  )
}`
    fs.writeFileSync(pageFile, content, "utf8")
    console.log("✅ Created:", pageFile)
  }
}

// Start process
createPageFiles(baseDir)
console.log("\n🎉 All page.tsx files created successfully!")
