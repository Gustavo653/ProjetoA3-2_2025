# ProjetoA3-2_2025

## Descrição
Este projeto consiste em um sistema de gerenciamento de entregas e monitoramento desenvolvido como parte de uma atividade acadêmica por três alunos da faculdade. O sistema oferece funcionalidades para cadastrar e gerenciar motoristas, caminhões, rastrear entregas e exibir informações em tempo real no painel de monitoramento. A aplicação é construída com uma stack moderna que inclui Angular (TypeScript) para o frontend, Python para o backend, HTML e CSS para a estrutura e estilização, e Docker para containerização e ambiente de desenvolvimento consistente.

## Requisitos
- **Docker**: Versão 20.10 ou superior, com Docker Compose incluído.
- **Git**: Para clonar o repositório e gerenciar o controle de versão.
- **Conexão à Internet**: Essencial para baixar dependências e imagens Docker durante o build inicial.
- **Espaço em Disco**: Recomenda-se pelo menos 10GB livres para containers e dependências.

## Como Rodar o Projeto
1. **Clone o repositório**:
   ```
   git clone https://github.com/Gustavo653/ProjetoA3-2_2025.git
   ```
2. **Navegue até o diretório do projeto**:
   ```
   cd ProjetoA3-2_2025
   ```
3. **Inicie o projeto**:
   - Verifique se o Docker Desktop (ou equivalente) está ativo.
   - Execute o comando abaixo para buildar e iniciar os containers:
     ```
     docker compose up --build
     ```
   - Aguarde a inicialização completa (pode levar alguns minutos na primeira execução). Acesse a aplicação em `http://localhost:4200` no navegador.
4. **Parar o projeto**:
   - Pressione `Ctrl + C` para parar os containers.
   - Para remover os containers e liberar recursos, use:
     ```
     docker compose down
     ```
   - Para uma limpeza completa (incluindo volumes), adicione a flag `--volumes`:
     ```
     docker compose down --volumes
     ```

## Estrutura do Projeto
- **`frontend/`**: Diretório com o código fonte do frontend em Angular (TypeScript, HTML, CSS), incluindo componentes e serviços.
- **`backend/`**: Contém a lógica do backend em Python, com APIs e integração de dados.
- **`docker-compose.yml`**: Arquivo de configuração para orquestração dos serviços Docker (frontend, backend, e possivelmente banco de dados).
- **`Dockerfile`**: Instruções para buildar as imagens Docker personalizadas.
- **`docs/`**: (Opcional) Diretório para documentação adicional ou capturas de tela.

## Telas do sistema
- [Motoristas] Tela de cadastro e gerenciamento de motoristas.
- [Caminhões] Registro de veículos e suas especificações.
- [Entregas] Gerenciamento de rotas e status das entregas.
- [Monitoramento] Painel de rastreamento em tempo real.

## Contribuidores
- Gustavo Henrique da Silva - 152210460
- Felipe Girardi Macedo - 152220418
- Cauã Leão - 152312577

## Instituição
- UNISOCIESC - Blumenau

## Notas Adicionais
- **Desenvolvimento Local**: Após editar arquivos em `frontend` ou `backend`, rebuild os containers com `docker compose up --build` para aplicar as mudanças.
- **Depuração**: Verifique logs detalhados com `docker compose logs` ou `docker compose logs <serviço>` (substitua `<serviço>` por `frontend` ou `backend`).
- **Portas**: Por padrão, o frontend usa a porta 4200. Conflitos de porta podem ser ajustados no `docker-compose.yml`.
