@echo off
chcp 65001 >nul
rem ==========================================================
rem  Copiaza datele din data\date.json in data\date.js
rem  (date.js este folosit cand site-ul e deschis cu dublu-click)
rem  Ruleaza acest fisier de fiecare data cand modifici date.json.
rem ==========================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "$j = [IO.File]::ReadAllText('%~dp0data\date.json', [Text.Encoding]::UTF8); try { $null = $j | ConvertFrom-Json } catch { Write-Host 'EROARE: data\date.json nu este un JSON valid. Verifica virgulele si ghilimelele.'; exit 1 }; $t = '// Generat automat din date.json de actualizeaza-date.bat - NU edita acest fisier, editeaza date.json' + [Environment]::NewLine + 'window.DATE_TRONCIU = ' + $j + ';'; [IO.File]::WriteAllText('%~dp0data\date.js', $t, (New-Object Text.UTF8Encoding $false)); Write-Host 'Gata! data\date.js a fost actualizat din data\date.json.'"
pause
