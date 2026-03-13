Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "c:\News"
WshShell.Run "cmd /c npm run dev", 0, False

WScript.Sleep 5000

WshShell.Run "http://localhost:3000", 0, False
