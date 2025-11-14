@echo off
echo ====================================
echo Iniciando servidor HTTP local...
echo ====================================
echo.
echo El servidor estara disponible en:
echo http://localhost:8000/mapa_escuelas.html
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
cd docs
..\venv\Scripts\python.exe -m http.server 8000
