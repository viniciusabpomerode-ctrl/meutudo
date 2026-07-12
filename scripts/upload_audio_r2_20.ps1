param([string]$Source = "$PSScriptRoot\..\r2-audios")

$env:R2_ACCOUNT_ID = Read-Host "Cloudflare Account ID"
$env:R2_ACCESS_KEY_ID = Read-Host "R2 Access Key ID"
$secure = Read-Host "R2 Secret Access Key" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try { $env:R2_SECRET_ACCESS_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }

python -m pip install "boto3>=1.34,<2"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
python "$PSScriptRoot\upload_profession_audio.py" --source "$Source" --workers 20
$code = $LASTEXITCODE
Remove-Item Env:R2_SECRET_ACCESS_KEY -ErrorAction SilentlyContinue
exit $code
