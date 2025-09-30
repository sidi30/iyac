@echo off
echo ========================================
echo   DEPLOIEMENT LIBERTE IYAC.COM
echo ========================================
echo.

echo 1. Nettoyage du dossier docs...
if exist docs rmdir /s /q docs

echo 2. Build pour liberteiyac.com...
call npm run build:liberteiyac

echo 3. Verification du build...
if exist docs\browser\index.html (
    echo ✅ Build reussi!
    echo ✅ Base href: https://liberteiyac.com/
    echo ✅ Fichiers JS/CSS generes
) else (
    echo ❌ Erreur de build!
    pause
    exit /b 1
)

echo.
echo 4. Ajout des fichiers au git...
git add .
git commit -m "Deploy liberteiyac.com - Fix CORS $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

echo 5. Push vers GitHub...
git push origin main

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE!
echo ========================================
echo.
echo Votre site sera disponible dans 5-10 minutes:
echo https://liberteiyac.com
echo.
echo Si le probleme persiste:
echo 1. Attendez 10 minutes pour la propagation
echo 2. Videz le cache (Ctrl+F5)
echo 3. Verifiez les DNS
echo.
pause
