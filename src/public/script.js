function getNome() {
    var nome;
    while (true) {
        nome = window.prompt("Insira seu nome:");
        if (nome.length < 1) {
            window.alert("Nome é obrigatorio.")
            continue
        }

        if (nome.length > 20) {
            window.alert("Nome deve ter menos de 20 caracteres.")
            continue
        }

        if (/[^a-zA-Z0-9]/.test(nome)) {
            window.alert("Nome não deve conter caracteres especiais ou espaço.")
            continue
        }

        break
    }

    return nome
}

const CLASSES = {
    [1]: "Determinação",
    [2]: "Justiça",
}

function getClasse() {
    var class_id;
    while (true) {
        var text_prompt = ""

        for (const [key, value] of Object.entries(CLASSES)) {
            text_prompt += `[${key}]: ${value}\n`
        }

        text_prompt += "\nInsira o numero da sua classe"

        class_id = window.prompt(text_prompt);
        if (nome.length < 1) {
            window.alert("Classe é obrigatoria.")
            continue
        }

        if (!Number(class_id)) {
            window.alert("Insira um numero.")
            continue
        }

        if (!CLASSES[Number(class_id)]) {
            window.alert("Numero de classe invalida.")
            continue
        }

        break
    }

    return Number(class_id)
}

const socket = io();

socket.on('connect', () => {
    console.log('Connected with ID:', socket.id);
});

function register() {
    const nome = getNome()
    const id_classe = getClasse()

    socket.emit('register', {
        nome: nome,
        id_classe: id_classe
    })

    socket.on('registered', (token) => {
        document.cookie = token
    })
}

function startDataLoop() {
    socket.on('recieve-data', (data) => {
        console.log(data);
    });

    setInterval(() => {
        const token = document.cookie
        if (token.length <= 0) {
            return
        }

        socket.emit('request-data', token)
    }, 1000);
}

function init() {
    startDataLoop()

    if (document.cookie = '') {
        register()
    }
}

init()