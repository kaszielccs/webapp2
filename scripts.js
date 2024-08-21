function displayForm() {
    const platform = document.getElementById('platform').value;
    const formSection = document.getElementById('form-section');

    if (platform) {
        formSection.classList.remove('hidden');
    }
}

function addRow() {
    const table = document.getElementById('server-form').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const nameCell = newRow.insertCell(0);
    const osCell = newRow.insertCell(1);
    const diskCell = newRow.insertCell(2);
    const memoryCell = newRow.insertCell(3);
    const coresCell = newRow.insertCell(4);
    const actionCell = newRow.insertCell(5);

    nameCell.innerHTML = `<input type="text" placeholder="Servidor">`;
    osCell.innerHTML = `
        <select>
            <option value="Windows">Windows</option>
            <option value="Linux">Linux</option>
            <option value="Ubuntu">Ubuntu</option>
        </select>`;
    diskCell.innerHTML = `<input type="number" placeholder="Capacidad (GB)" min="0">`;
    memoryCell.innerHTML = `<input type="number" placeholder="Memoria (GB)" min="0">`;
    coresCell.innerHTML = `<input type="number" placeholder="Cores" min="0">`;
    actionCell.innerHTML = `<button class="btn" onclick="deleteRow(this)">Eliminar</button>`;
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function generateScript() {
    const platform = document.getElementById('platform').value;
    const scriptType = document.getElementById('script-type').value;
    const table = document.getElementById('server-form').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    let script = "";

    for (let i = 0; i < rows.length; i++) {
        const name = rows[i].cells[0].getElementsByTagName('input')[0].value;
        const os = rows[i].cells[1].getElementsByTagName('select')[0].value;
        const disk = rows[i].cells[2].getElementsByTagName('input')[0].value;
        const memory = rows[i].cells[3].getElementsByTagName('input')[0].value;
        const cores = rows[i].cells[4].getElementsByTagName('input')[0].value;

        if (platform === "avs" && scriptType === "powercli") {
            script += `New-VM -Name "${name}" -OS "${os}" -DiskGB ${disk} -MemoryGB ${memory} -Cores ${cores}\n`;
        } else if (platform === "iaas" && scriptType === "terraform") {
            script += `resource "azurerm_virtual_machine" "${name}" {\n`;
            script += `  os_type = "${os}"\n`;
            script += `  disk_size_gb = ${disk}\n`;
            script += `  memory_size_gb = ${memory}\n`;
            script += `  cores = ${cores}\n`;
            script += `}\n\n`;
        } else if (platform === "iaas" && scriptType === "arm") {
            script += `{\n  "name": "${name}",\n  "os": "${os}",\n  "disk": ${disk},\n  "memory": ${memory},\n  "cores": ${cores}\n},\n`;
        }
    }

    document.getElementById('script-output').textContent = script;
    document.getElementById('output-section').classList.remove('hidden');

    generateInstructions(platform, scriptType);
}

function generateInstructions(platform, scriptType) {
    let instructions = "";

    if (platform === "avs") {
        instructions += "1. Conéctese a su entorno de Azure VMware Solution.\n";
        instructions += "2. Copie y pegue el script PowerCLI en su consola.\n";
        instructions += "3. Ejecute el script para aprovisionar las máquinas virtuales.\n";
    } else if (platform === "iaas" && scriptType === "terraform") {
        instructions += "1. Asegúrese de tener Terraform instalado y configurado.\n";
        instructions += "2. Cree un archivo .tf y pegue el script generado.\n";
        instructions += "3. Ejecute `terraform init`, `terraform plan`, y `terraform apply` para desplegar las máquinas virtuales.\n";
    } else if (platform === "iaas" && scriptType === "arm") {
        instructions += "1. Guarde el script en un archivo JSON.\n";
        instructions += "2. Despliegue el archivo ARM utilizando Azure CLI o Azure Portal.\n";
    }

    document.getElementById('instructions').textContent = instructions;
    document.getElementById('instructions-section').classList.remove('hidden');
}

function downloadScript() {
    const script = document.getElementById('script-output').textContent;
    const blob = new Blob([script], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "script.txt";
    link.click();
}
