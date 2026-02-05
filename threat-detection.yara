rule Suspicious_PE_Section_Names
{
    meta:
        description = "Detects PE files with suspicious section names"
        severity = "medium"
        category = "executable"
        
    strings:
        $section1 = ".upx" nocase
        $section2 = ".aspack" nocase
        $section3 = ".adata" nocase
        $section4 = ".boom" nocase
        $section5 = ".ccg" nocase
        $section6 = ".ndata" nocase
        
    condition:
        uint16(0) == 0x5A4D and any of ($section*)
}

rule Packed_Executable
{
    meta:
        description = "Detects packed executable files"
        severity = "high"
        category = "executable"
        
    condition:
        uint16(0) == 0x5A4D and
        pe.sections[0].raw_data_size == 0 or
        pe.sections[0].virtual_size > pe.sections[0].raw_data_size * 10
}

rule High_Entropy_Executable
{
    meta:
        description = "Detects executables with high entropy (possible encryption/packing)"
        severity = "high"
        category = "executable"
        
    condition:
        uint16(0) == 0x5A4D and
        math.entropy(0, filesize) >= 7.0
}

rule Suspicious_Imports
{
    meta:
        description = "Detects suspicious Windows API imports"
        severity = "high"
        category = "executable"
        
    strings:
        $api1 = "VirtualAllocEx" ascii
        $api2 = "WriteProcessMemory" ascii
        $api3 = "CreateRemoteThread" ascii
        $api4 = "SetWindowsHookEx" ascii
        $api5 = "GetAsyncKeyState" ascii
        $api6 = "InternetReadFile" ascii
        $api7 = "URLDownloadToFile" ascii
        
    condition:
        uint16(0) == 0x5A4D and 3 of ($api*)
}

// ==================== RANSOMWARE INDICATORS ====================

rule Ransomware_Extensions
{
    meta:
        description = "Detects ransomware file extension patterns"
        severity = "critical"
        category = "ransomware"
        
    strings:
        $ext1 = ".locked" nocase
        $ext2 = ".encrypted" nocase
        $ext3 = ".crypto" nocase
        $ext4 = ".cerber" nocase
        $ext5 = ".locky" nocase
        $ext6 = ".zepto" nocase
        $ext7 = ".osiris" nocase
        
    condition:
        any of ($ext*)
}

rule Ransomware_Note_Keywords
{
    meta:
        description = "Detects common ransomware note keywords"
        severity = "critical"
        category = "ransomware"
        
    strings:
        $phrase1 = "your files have been encrypted" nocase
        $phrase2 = "bitcoin" nocase
        $phrase3 = "decrypt" nocase
        $phrase4 = "private key" nocase
        $phrase5 = "payment" nocase
        $phrase6 = "deadline" nocase
        
    condition:
        3 of ($phrase*)
}

// ==================== MALICIOUS SCRIPTS ====================

rule PowerShell_Obfuscation
{
    meta:
        description = "Detects obfuscated PowerShell scripts"
        severity = "high"
        category = "script"
        
    strings:
        $cmd1 = "-encodedcommand" nocase
        $cmd2 = "-enc" nocase
        $cmd3 = "FromBase64String" nocase
        $cmd4 = "DownloadString" nocase
        $cmd5 = "DownloadFile" nocase
        $cmd6 = "IEX" nocase
        $cmd7 = "Invoke-Expression" nocase
        $cmd8 = "Net.WebClient" nocase
        
    condition:
        2 of ($cmd*)
}

rule Suspicious_JavaScript
{
    meta:
        description = "Detects suspicious JavaScript patterns"
        severity = "medium"
        category = "script"
        
    strings:
        $js1 = "eval(" nocase
        $js2 = "unescape(" nocase
        $js3 = "fromCharCode" nocase
        $js4 = "ActiveXObject" nocase
        $js5 = "WScript.Shell" nocase
        $js6 = "document.write" nocase
        
    condition:
        3 of ($js*)
}

rule Malicious_Batch_Script
{
    meta:
        description = "Detects potentially malicious batch script commands"
        severity = "high"
        category = "script"
        
    strings:
        $cmd1 = "reg add" nocase
        $cmd2 = "schtasks" nocase
        $cmd3 = "netsh firewall" nocase
        $cmd4 = "vssadmin delete shadows" nocase
        $cmd5 = "bcdedit" nocase
        $cmd6 = "wmic" nocase
        
    condition:
        2 of ($cmd*)
}

// ==================== MALICIOUS DOCUMENTS ====================

rule Malicious_Macro_Keywords
{
    meta:
        description = "Detects suspicious VBA macro keywords"
        severity = "high"
        category = "document"
        
    strings:
        $macro1 = "AutoOpen" nocase
        $macro2 = "Auto_Open" nocase
        $macro3 = "Document_Open" nocase
        $macro4 = "Workbook_Open" nocase
        $macro5 = "Shell" nocase
        $macro6 = "WScript.Shell" nocase
        $macro7 = "CreateObject" nocase
        $macro8 = "GetObject" nocase
        
    condition:
        3 of ($macro*)
}

rule Embedded_PE_in_Document
{
    meta:
        description = "Detects embedded PE executable in document"
        severity = "critical"
        category = "document"
        
    strings:
        $mz = "MZ"
        $pe = "PE\x00\x00"
        
    condition:
        $mz at 0 or
        ($mz in (0..1024) and $pe)
}

// ==================== SUSPICIOUS URLs ====================

rule Suspicious_URL_Patterns
{
    meta:
        description = "Detects suspicious URL patterns"
        severity = "medium"
        category = "url"
        
    strings:
        $url1 = /https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/ nocase
        $url2 = ".php?" nocase
        $url3 = "eval=" nocase
        $url4 = "base64" nocase
        $url5 = "exec=" nocase
        $url6 = "shell=" nocase
        
    condition:
        any of ($url*)
}

rule Phishing_Keywords
{
    meta:
        description = "Detects common phishing keywords"
        severity = "high"
        category = "url"
        
    strings:
        $phish1 = "verify your account" nocase
        $phish2 = "confirm your identity" nocase
        $phish3 = "suspended account" nocase
        $phish4 = "unusual activity" nocase
        $phish5 = "click here immediately" nocase
        $phish6 = "urgent action required" nocase
        
    condition:
        any of ($phish*)
}

// ==================== CRYPTO MINERS ====================

rule Cryptocurrency_Miner
{
    meta:
        description = "Detects cryptocurrency mining software"
        severity = "high"
        category = "miner"
        
    strings:
        $miner1 = "stratum+tcp://" nocase
        $miner2 = "stratum+ssl://" nocase
        $miner3 = "xmrig" nocase
        $miner4 = "cpuminer" nocase
        $miner5 = "minerd" nocase
        $miner6 = "cryptonight" nocase
        $miner7 = "mining pool" nocase
        
    condition:
        any of ($miner*)
}

// ==================== KEYLOGGERS ====================

rule Keylogger_Behavior
{
    meta:
        description = "Detects keylogger behavioral patterns" 
        severity = "critical"
        category = "spyware"
        
    strings:
        $key1 = "GetAsyncKeyState" ascii
        $key2 = "GetKeyboardState" ascii
        $key3 = "SetWindowsHookEx" ascii
        $key4 = "WH_KEYBOARD" ascii
        $key5 = "keylog" nocase
        
    condition:
        uint16(0) == 0x5A4D and 2 of ($key*)
}

// ==================== TROJANS ====================

rule Remote_Access_Trojan
{
    meta:
        description = "Detects Remote Access Trojan indicators"
        severity = "critical"
        category = "trojan"
        
    strings:
        $rat1 = "cmd.exe" nocase
        $rat2 = "CreateProcess" ascii
        $rat3 = "recv" ascii
        $rat4 = "send" ascii
        $rat5 = "socket" ascii
        $rat6 = "WSAStartup" ascii
        
    condition:
        uint16(0) == 0x5A4D and 4 of ($rat*)
}
