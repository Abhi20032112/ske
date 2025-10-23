$images = Get-ChildItem -Path "assets/img" -Include "*.jpg","*.jpeg","*.png" -Recurse

foreach ($image in $images) {
    $outputPath = "assets/img/optimized/$($image.BaseName).webp"
    
    # Create output directory if it doesn't exist
    $outputDir = Split-Path $outputPath -Parent
    if (!(Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force
    }
    
    # Convert to WebP with quality 80 (good balance between quality and size)
    sharp $image.FullName -o $outputPath --format webp --quality 80
    
    Write-Host "Optimized: $($image.Name) -> $outputPath"
}
