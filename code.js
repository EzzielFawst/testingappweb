//Definición de variables
let mesaNumero = document.getElementById('mesaNumber').innerHTML
const url = `http://18.220.101.120/:1337/api/mesa${mesaNumero}/`
const regList = document.querySelector('tbody');
const searchBar = document.getElementById('searchBar');
const btnTodos = document.getElementById('btnTodos')
const btnVotaron = document.getElementById('btnVotaron')
const btnNoVotaron = document.getElementById('btnNoVotaron')
let votantes = [];

//Función de búsqueda
searchBar.addEventListener('keyup', (e) => {
    btnTodos.disabled = false
    btnNoVotaron.disabled = false
    btnVotaron.disabled = false
    const searchString = e.target.value.toLowerCase();
    if(searchString==''){
        btnTodos.disabled = true
    }

    const votantesFiltrados = votantes.filter((votante) => {
        const votanteNombreCompleto = votante.apellido+' '+votante.nombre+' '+votante.dni
        return (
            votanteNombreCompleto.toLowerCase().includes(searchString)
        );
    });
    mostrar(votantesFiltrados);
});


//Función de filtrado (botones)
btnTodos.addEventListener('click', (e) => {
    btnTodos.disabled = true
    btnNoVotaron.disabled = false
    btnVotaron.disabled = false
    searchBar.value=''
    const votantesFiltrados = votantes.filter((votante) => {
        return (
            votante.votacion==0 ||
            votante.votacion==1
        );
    });
    mostrar(votantesFiltrados);
});

btnVotaron.addEventListener('click', (e) => {
    btnTodos.disabled = false
    btnNoVotaron.disabled = false
    btnVotaron.disabled = true
    searchBar.value=''
    const votantesFiltrados = votantes.filter((votante) => {
        return (
            votante.votacion==1
        );
    });
    mostrar(votantesFiltrados);
});

btnNoVotaron.addEventListener('click', (e) => {
    btnTodos.disabled = false
    btnNoVotaron.disabled = true
    btnVotaron.disabled = false
    searchBar.value=''
    const votantesFiltrados = votantes.filter((votante) => {
        return (
            votante.votacion==0
        );
    });
    mostrar(votantesFiltrados);
});

//Función para cargar los votantes
const cargarVotantes = async () => {
    try {
        const res = await fetch(url);
        votantes = await res.json();
        mostrar(votantes);
    } catch (err) {
        console.error(err);
    }
};

const modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'))
const formRegistro = document.querySelector('form')
const nombre = document.getElementById('registroNombre')
const apellido = document.getElementById('registroApellido')
const dni = document.getElementById('registroDni')
const mesa = document.getElementById('registroMesa')
const votacion = document.getElementById('registroVotacion')
let opcion = ''

btnCrear.addEventListener('click', () => {
    let mesasa = document.getElementById('mesaNumber').innerHTML
    let mesaNumero = parseInt(mesasa)
    nombre.value = ''
    apellido.value = ''
    dni.value = ''
    mesa.value = mesaNumero
    votacion.value=0
    modalRegistro.show()
    opcion = 'crear'
})

//Función para mostrar los resultados
const mostrar = (registros) => {
    const htmlString = registros
        .map((registro) => {
            if(registro.votacion==1) {
                return `
                <tr class='selectMe' id='${registro.id}'>
                <td class="text-center centerialize" style="background-color: #75b55e; color: white;">${registro.id}</td>
                <td class="text-center centerialize" style="background-color: #75b55e; color: white;">${registro.apellido}</td>
                <td class="text-center centerialize" style="background-color: #75b55e; color: white;">${registro.nombre}</td>
                <td class="text-center centerialize" style="background-color: #75b55e; color: white;">${registro.dni}</td>
                <td class="text-center centerialize hidden">${registro.mesa}</td>
                <td class="text-center centerialize hidden">${registro.votacion}</td>
                <td class="text-center"><a class="btnBorrar btn btn-danger">X</a></td>
                </tr>`;
            }else{
                return `<tr class='selectMe' id='${registro.id}'>
                <td class="text-center centerialize">${registro.id}</td>
                <td class="text-center centerialize">${registro.apellido}</td>
                <td class="text-center centerialize">${registro.nombre}</td>
                <td class="text-center centerialize">${registro.dni}</td>
                <td class="text-center centerialize hidden">${registro.mesa}</td>
                <td class="text-center centerialize hidden">${registro.votacion}</td>
                <td class="text-center"><a class="btnEditar btn btn-primary">✓</a></td>
                </tr>`
            }
            
        })
        .join('');
    regList.innerHTML = htmlString;
};


cargarVotantes();


const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const row = e.target.parentNode.parentNode
    const id = row.children[0].innerHTML
    const apellidoForm = row.children[1].innerHTML
    const nombreForm = row.children[2].innerHTML
    const dniForm = row.children[3].innerHTML
    const mesaForm = row.children[4].innerHTML
    const votacionForm = 0
    alertify.confirm(`Desea deshacer la votación de ${apellidoForm}, ${nombreForm}?`,
    function(){
        fetch(url+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apellido:apellidoForm,
                nombre:nombreForm,
                dni:dniForm,
                mesa:mesaForm,
                votacion:votacionForm
            })
        })
        .then( response => response.json() )
        .then( response => location.reload())
        //alertify.success('Ok');
    },
    function(){
        //alertify.error('Cancel');
    });
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const row = e.target.parentNode.parentNode
    idForm = row.children[0].innerHTML
    const apellidoForm = row.children[1].innerHTML
    const nombreForm = row.children[2].innerHTML
    const dniForm = row.children[3].innerHTML
    const mesaForm = row.children[4].innerHTML
    const votacionForm = 1
    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apellido:apellidoForm,
            nombre:nombreForm,
            dni:dniForm,
            mesa:mesaForm,
            votacion:votacionForm
        })
    })
    .then( response => response.json() )
    .then( response => location.reload())
})


//Procedimiento Crear y/o Editar
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault()
    if(opcion=='crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apellido:apellido.value,
                nombre:nombre.value,
                dni:dni.value,
                mesa:mesa.value,
                votacion:votacion.value
            })
        })
        .then( response => response.json())
        .then( data => {
            const nuevoRegistro = []
            nuevoRegistro.push(data)
            location.reload()
        })
    }
    if(opcion=='editar'){
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apellido:apellido.value,
                nombre:nombre.value,
                dni:dni.value,
                mesa:mesa.value,
                votacion:1
            })
        })
        .then( response => response.json() )
        .then( response => location.reload())
    }
    modalRegistro.hide()
})