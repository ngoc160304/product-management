
// Permisions form
const tableRolePermissions = document.querySelector("[table-roles-permissions]");
if(tableRolePermissions) {
    const rows = tableRolePermissions.querySelectorAll("[data-name]");
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        const permissions = [];
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name === "id") {
                inputs.forEach(input => {
                    permissions.push({
                        id: input.value,
                        permissions: []
                    })                
                })
            } else {
                inputs.forEach((input, index) => {
                    if(input.checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        if(permissions.length) {
            const formChangePermissions = document.querySelector("[form-change-pemissions]");
            if(formChangePermissions) {
                const inputPermissions = document.querySelector("[input-permissions]");
                inputPermissions.value = JSON.stringify(permissions);
                formChangePermissions.submit();
            }
        }
    })
}

// Permissions form end

// input checkbox
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    console.log(records);
    records.forEach((record, index) => {
        record.permissions.forEach(item => {
            const row = document.querySelector(`[data-name=${item}]`);
            const inputs = row.querySelectorAll("input");
            inputs[index].checked = true;
        })
    })
}
// input checkbox end