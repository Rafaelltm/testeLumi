# TESTE DE PRÁTICO LUMI – DESENVOLVEDOR(A) FULL STACK PLENO(A)
###### Rafael Leão Teixeira de Magalhães

Atualmente a aplicação tem duas actions que escutam o push na branch main e realizam os testes antes de fazer o deploy no heroku

##### Endereço do deploy da aplicação: 
https://teste-lumi-front-ade9fe8129f5.herokuapp.com/

## Como utilizar a aplicação

### Utilizando o Docker

- Clonar o repositório `git clone https://github.com/Rafaelltm/testeLumi.git`

- Executar o comando `docker-compose up --build`

- Para se conectar ao banco de dados com alguma ferramenta de administração de banco de dados como o dbeaver utilize as seguintes configurações:
  - Host: localhost
  - Port: 5432
  - Database: teste-lumi-db (o nome do banco de dados definido no docker-compose.yml)
  - Username: root (o usuário definido no docker-compose.yml)
  - Password: root (a senha definido no docker-compose.yml)

### Sem o Docker

- Clonar o repositório `git clone https://github.com/Rafaelltm/testeLumi.git`

#### Front-end

- Definir as variáveis de embiente em um arquivo `.env` utilizando o `.env.example` como base

- Executar o comando `npm install`

- Executar o comando `npm start`

- Para executar os testes unitários `npm run test`

#### Back-end

- Criar o banco de dados PostgreSQL

- Definir as variáveis de embiente em um arquivo `.env` utilizando o `.env.example` como base

- Executar o comando `npm install`

- Executar o comando `npm run dev`

- Para executar os testes unitários `npm run test`