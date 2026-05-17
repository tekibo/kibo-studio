export async function openFileDialog(filters?: string): Promise<string> {
    try {
        const filterArg = filters ? `$f.Filter = '${filters.replace(/'/g, "''")}'` : "";
        const script = `
Add-Type -AssemblyName System.Windows.Forms
$f = New-Object System.Windows.Forms.OpenFileDialog
${filterArg}
$f.Multiselect = $false
if ($f.ShowDialog() -eq 'OK') { Write-Output $f.FileName }
`;
        const proc = Bun.spawn(["powershell", "-NoProfile", "-Command", script], { stdout: "pipe", stderr: "pipe" });
        const output = await new Response(proc.stdout).text();
        return output.trim();
    } catch {
        return "";
    }
}

export async function openFolderDialog(): Promise<string> {
    try {
        const script = `
Add-Type -AssemblyName System.Windows.Forms
$f = New-Object System.Windows.Forms.FolderBrowserDialog
$f.Description = 'Select a folder'
if ($f.ShowDialog() -eq 'OK') { Write-Output $f.SelectedPath }
`;
        const proc = Bun.spawn(["powershell", "-NoProfile", "-Command", script], { stdout: "pipe", stderr: "pipe" });
        const output = await new Response(proc.stdout).text();
        return output.trim();
    } catch {
        return "";
    }
}

export async function pickSavePath(defaultName: string): Promise<string> {
    try {
        const script = `
Add-Type -AssemblyName System.Windows.Forms
$f = New-Object System.Windows.Forms.SaveFileDialog
$f.FileName = '${defaultName.replace(/'/g, "''")}'
$f.Filter = 'PNG images (*.png)|*.png|All files (*.*)|*.*'
if ($f.ShowDialog() -eq 'OK') { Write-Output $f.FileName }
`;
        const proc = Bun.spawn(["powershell", "-NoProfile", "-Command", script], { stdout: "pipe", stderr: "pipe" });
        const output = await new Response(proc.stdout).text();
        return output.trim();
    } catch {
        return "";
    }
}
