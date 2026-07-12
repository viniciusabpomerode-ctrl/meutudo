param(
  [string]$Json = "$PSScriptRoot\..\data\profissoes.json",
  [string]$Output = "$PSScriptRoot\..\r2-audios"
)

python -m pip install -r "$PSScriptRoot\requirements-audio.txt"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

python "$PSScriptRoot\generate_profession_audio.py" "$Json" --output "$Output" --workers 20
exit $LASTEXITCODE
