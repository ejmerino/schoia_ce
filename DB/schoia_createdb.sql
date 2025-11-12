-- Tabla de Universidades
CREATE TABLE universidades (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    pais VARCHAR(100),
    siglas VARCHAR(20)
);

-- Tabla de Carreras
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    arancel_por_credito NUMERIC(10, 2),
    valor_matricula NUMERIC(10, 2),
    universidad_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (universidad_id) REFERENCES universidades(id)
);

-- Tabla de Materias
CREATE TABLE materias (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    creditos INT NOT NULL,
    dificultad VARCHAR(50),
    semestre INT NOT NULL,
    carrera_id INT NOT NULL,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);

-- Tabla de Prerrequisitos (Relación N:N entre Materias)
CREATE TABLE prerrequisitos (
    materia_codigo VARCHAR(50) NOT NULL,
    prerrequisito_codigo VARCHAR(50) NOT NULL,
    PRIMARY KEY (materia_codigo, prerrequisito_codigo),
    FOREIGN KEY (materia_codigo) REFERENCES materias(codigo),
    FOREIGN KEY (prerrequisito_codigo) REFERENCES materias(codigo)
);

-- Tabla de Correquisitos (Relación N:N entre Materias)
CREATE TABLE correquisitos (
    materia_codigo VARCHAR(50) NOT NULL,
    correquisito_codigo VARCHAR(50) NOT NULL,
    PRIMARY KEY (materia_codigo, correquisito_codigo),
    FOREIGN KEY (materia_codigo) REFERENCES materias(codigo),
    FOREIGN KEY (correquisito_codigo) REFERENCES materias(codigo)
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id VARCHAR(255) PRIMARY KEY, -- Ideal para UIDs de Firebase Auth u otro proveedor
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255),
    rol VARCHAR(50) DEFAULT 'ESTUDIANTE',
    fecha_de_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Progreso del Usuario
CREATE TABLE progreso (
    id SERIAL PRIMARY KEY,
    completed BOOLEAN DEFAULT false,
    usuario_id VARCHAR(255) NOT NULL,
    materia_codigo VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (materia_codigo) REFERENCES materias(codigo),
    UNIQUE (usuario_id, materia_codigo) -- ¡Restricción importante!
);