# setup.ps1
# Dieses Skript erstellt das benötigte Verzeichnis und die Dateien für das ChatWidget in PowerShell.

# Erstelle das Verzeichnis (Falls bereits vorhanden, wird -Force verwendet, um keine Fehler zu erzeugen)
New-Item -ItemType Directory -Force -Path "src/components/ChatWidget"

# Erstelle die Datei ChatWidget.jsx
New-Item -ItemType File -Force -Path "src/components/ChatWidget/ChatWidget.jsx"

# Erstelle die Datei ChatWidget.css
New-Item -ItemType File -Force -Path "src/components/ChatWidget/ChatWidget.css"

Write-Output "Das Setup des ChatWidgets wurde abgeschlossen." 