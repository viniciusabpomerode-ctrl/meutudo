$ErrorActionPreference = "Stop"
$secureKey = Read-Host "Cole a chave da API DeepSeek" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try {
  $env:DEEPSEEK_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  $python = "python"
  & $python "$PSScriptRoot\translate_interface_gaps_deepseek.py"
  if ($LASTEXITCODE -ne 0) {
    throw "A tradução terminou com erro."
  }
  & $python "$PSScriptRoot\apply_interface_translations.py"
  if ($LASTEXITCODE -ne 0) {
    throw "As traduções foram geradas, mas não puderam ser aplicadas."
  }
  Write-Host ""
  Write-Host "Traduções geradas, validadas e aplicadas à interface." -ForegroundColor Green
} finally {
  Remove-Item Env:DEEPSEEK_API_KEY -ErrorAction SilentlyContinue
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
}
