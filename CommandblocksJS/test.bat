@echo off

echo Writing all Core Javascript code to ./core.js

echo.

xcopy ".\_core.js" ".\core.js" /Y

echo.

for %%f in (".\..\src\libs\*.js") do (
	for /f "usebackq delims=" %%x in ("%%f") do (
		if NOT "%%x"=="" @echo %%x >> .\core.js
	)
)

for %%f in (".\..\src\Apps\*.js") do (
	for /f "usebackq delims=" %%x in ("%%f") do (
		if NOT "%%x"=="" @echo %%x >> .\core.js
	)
)	

xcopy "C:\Users\Agent J\AppData\Roaming\.minecraft\saves\pvm" ".\world" /Y /E
echo.
Cmd.exe -s mcphone.js -w ./world -x 1 -y 4 -z 16
echo.
pause
echo.
xcopy ".\world" "C:\Users\Agent J\AppData\Roaming\.minecraft\saves\pvm2" /Y /E
