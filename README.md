[![CI/CD](https://github.com/ProgramasNS/PostPoint/actions/workflows/ci.yml/badge.svg)](https://github.com/ProgramasNS/PostPoint/actions/workflows/ci.yml)
<h1>PostPoint</h1>
<p>English version: <a href="./README.en.md">Click here</a></p>
<h2>O que é?</h2>
<p>Trata-se de um conjunto de APIs REST para um blog desenvolvido principalmente na linguagem de programação TypeScript.</p>
<h2>Tecnologias utilizadas</h2>
<ul>
    <li><strong>Express.js:</strong> Principal tecnologia, usada para a criação de APIs e requisições. Trata-se de um dos frameworks mais modernos e robustos para a criação de aplicações back-end;</li>
    <li><strong>Prisma:</strong> A ORM mais popular do mercado back-end. Permite a criação de models através do próprio arquivo <code>schema.prisma</code> e é responsável diretamente pela criação de tabelas e interações com o banco de dados.</li>
    <li><strong>PostgreSQL:</strong> Um dos SGBDs (Sistemas de Gerenciamento de Banco de Dados) mais populares baseados na linguagem SQL. É o próprio banco de dados da aplicação, o qual interage diretamente com o Prisma</li>
    <li><strong>Jest:</strong> O principal responsável pelos testes automatizados, os quais garantem a qualidade constante do software e proteção contra bugs inesperados</li>
    <li><strong>Docker:</strong> O responsável pela containerização da aplicação, a qual permite sua execução por meio de qualquer dispositivo através de um Dockerfile.</li>
    <li><strong>BCrypt:</strong> O responsável por criptografar as senhas enviadas em cada requisição.</li>
    <li><strong>Json Web Token (JWT):</strong> O principal responsável pela geração de tokens para a autenticação de usuários. Funciona por meio de uma chave secreta, a qual gera um token após o login do(a) usuário(a).</li>
</ul>
<h2>A padronização do código</h2>
<p>O código deste projeto foi baseado nos princípios da <strong>Programação Defensiva</strong></strong>: cada requisição de cada API prevê várias falhas possíveis, como a não-inserção de dados obrigatórios na requisição e a inserção de dados inválidos. Além disso, o código é feito para ser de fácil leitura e entendimento, com comentários esclarecendo vários pontos importantes sobre o código.</p>
<p>Além disso, o código é feito para ser prático e direto: O objeto HttpCodes, por exemplo, substitui números mágicos na hora de definir o <i>status code</i> de cada response. O código também é inteiramente composto por arrow functions, as quais facilitam a exportação e a legibilidade do código.</p>
<h2>As models</h2>
<p>As models da aplicação são definidas pelo Prisma através do arquivo <code>schema.prisma</code>. O schema possui três models, com cada uma correspondendo a uma tabela do banco de dados. São elas:</p>
<h3>users</h3>
<p>Esta model corresponde aos usuários da aplicação. Ela possui as seguintes propriedades: </p>
<ul>
    <li><strong>id:</strong> Propriedade única e inserida automaticamente após a criação de um user por meio do cadastro;</li>
    <li><strong>nickname:</strong> Propriedade única. Trata-se do username de cada usuário, sendo uma propriedade obrigatória tanto no cadastro quanto no login.</li>
    <li><strong>email:</strong> Propriedade única. Trata-se do e-mail correspondente a cada usuário(a). É obrigatório no cadastro, mas opcional no login.</li>
    <li><strong>password:</strong> Corresponde à senha criptografada de cada usuário(a). É obrigatória tanto para o cadastro quanto para o login.</li>
    <li><strong>profilePic:</strong> Propriedade opcional. Corresponde ao URL da foto de perfil do(a) usuário(a).</li>
    <li><strong>posts:</strong> Corresponde aos posts do(a) usuário(a).</li>
    <li><strong>comments:</strong> Corresponde aos comentários do(a) usuário(a).</li>
</ul>
<h3>posts</h3>
<p>Essa model corresponde aos posts pertencentes ao blog.</p>
<ul>
    <li><strong>id:</strong> Propriedade única e inserida automaticamente a cada criação de um novo post.</li>
    <li><strong>title:</strong> Propriedade opcional. Corresponde ao título do post, não necessariamente único. O valor padrão é "Post sem título".</li>
    <li><strong>content:</strong> Propriedade obrigatória. Corresponde ao conteúdo do post. Deve possuir pelo menos 10 caracteres.</li>
    <li><strong>user_id:</strong> Corresponde ao id do(a) criador(a) do post. Inserido automaticamente a cada post criado por um(a) usuário(a). Propriedade diretamente linkada à propriedade posts da model users.</li>
    <li><strong>users:</strong> Corresponde diretamente ao(à) user criador(a) do post.</li>
    <li><strong>createdAt:</strong> Corresponde à data de criação de um determinado post, definida por padrão como a data atual durante o momento da criação.</li>
    <li><strong>updatedAt:</strong> Corresponde à data de atualização de um determinado post, também definida automaticamente como o momento atual durante a atualização.</li>
    <li><strong>comments:</strong> Corresponde aos comentários pertencentes a um determinado post.</li>
</ul>
<h3>comments</h3>
<p>Corresponde aos comentários. Cada comentário obrigatoriamente pertence a um determinado post.</p>
<ul>
    <li><strong>id:</strong> Propriedade única e inserida automaticamente a cada criação de comentário;</li>
    <li><strong>content:</strong> Propriedade obrigatória. Corresponde ao conteúdo do comentário, o qual deve possuir pelo menos 10 caracteres;</li>
    <li><strong>user_id:</strong> Corresponde ao id do(a) criador(a) do comentário. Inserido automaticamente após a criação de cada comentário.</li>
    <li><strong>post_id:</strong> Corresponde ao id do post ao qual o comentário pertence. Inserido automaticamente após a criação de cada comentário.</li>
    <li><strong>users:</strong> Corresponde diretamente ao(à) user criador(a) do comentário.</li>
    <li><strong>posts:</strong> Corresponde diretamente ao post ao qual o comentário pertece.</li>
</ul>
<h2>A estrutura do projeto</h2>
<p>O projeto utiliza o padrão <strong>Model-View-Controller (MVC)</strong>, cujas APIs utilizam-se principalmente das models e dos controllers. Quanto à organização, o projeto baseia-se no princípio da <strong>Separação de Responsabilidades</strong>(<i>Separation of Concerns</i>, em inglês), um dos pilares do Clean Code, no qual as partes mais importantes do projeto são divididas em diferentes pastas. Entre as pastas estão:</p>
<h3>Controllers</h3>
<p>Responsáveis pelas requisições feitas com as models. Dentre eles estão: </p>
<ol>
    <li><h4>UserController.ts</h4></li>
    <p>Corresponde ao controller para a model users. Possui as funções cadastrarUsuário, método POST, o qual cadastra um(a) novo(a) user, login, também POST, o qual além de fazer login gera um token para autenticações JWT posteriores, e atualizarFoto, o qual é um método PUT que exige autenticação. Requisições obrigatórias: {nickname, email e password} para o cadastro e {nickname, password} para o login.</p>
    <li><h4>PostController.ts</h4></li>
    <p>Corresponde ao controller para a model posts. Possui um CRUD completo e funções extras para casos específicos. O método POST corresponde à função criarPost, sob o qual a autenticação é obrigatória (e inclusive possui prevenções para usuários não-autenticados); o método GET corresponde às funções listarPosts e listarPostsPorUsuario (o qual possui authorId como parâmetro nas routes); o método PUT corresponde à função atualizarPost, a qual requer autenticação e que o(a) usuário(a) autenticado(a) seja autor(a) do post; o método DELETE corresponde à função excluirComentário, a qual possui as mesmas exigências que a função do método PUT.</p>
    <li><h4>CommentController.ts</h4></li>
    <p>Corresponde ao controller para a model comments. Possui um CRUD completo e funções extras para casos específicos. O método POST corresponde à função criarComentario, a qual exige autenticação; o método GET corresponde às funções listarComentarios, listarComentariosPorUsuario, o qual possui userId como parâmetro nas routes, listarComentariosPorPost, o qual possui como parâmetro das routes postId; o método PUT corresponde à função atualizarComentario, a qual requer autenticação e que o(a) usuário(a) seja autor(a) do cometário; o método DELETE corresponde à função excluirComentário, com as mesmas exigências que a função do método PUT.</p>
</ol>
<h3>Middlewares</h3>
<p>Corresponde à pasta dedicada à criação de tokens. Possui apenas o módulo exportado verificarToken, o qual é responsável por gerar e verificar autenticação JWT.</p>
<h3>Routes</h3>
<p>Corresponde à pasta dedicada às routes, as quais mapeiam as funções, os métodos e define quais funções necessitam de autenticação. Possui os arquivos: </p>
<ol>
    <li><strong>DefaultRoutes.ts:</strong> Define a route na raiz do servidor, que invoca um método GET com a apresentação da aplicação;</li>
    <li><strong>UserRoutes.ts:</strong> Define as routes e invoca os métodos do UserController;</li>
    <li><strong>PostRoutes.ts:</strong> Define as routes e invoca os métodos do PostController;</li>
    <li><strong>CommentRoutes.ts:</strong> Define as routes e invoca os métodos do CommentController.</li>
    <p><strong>OBS:</strong> Para funções que exigem autenticação, a função "verificarToken" era o parâmetro de cada método POST, PUT e DELETE; para as funções GET, a autenticação está ausente.</p>
</ol>
<h3>db</h3>
<p>Corresponde à pasta dedicada ao instanciamento do banco de dados, o qual é exportado como PrismaClient pelos seus dois módulos: Database.ts e TestsDatabase.ts. O PrismaClient do Database.ts é baseado no próprio schema gerado pelo Prisma, e é o meio pelo qual o banco de dados é invocado no código. O TestsDatabase.ts é o PrismaClient específico para testes automatizados</p>
<h3>objects</h3>
<p>Corresponde à pasta dedicada aos objetos universais, feitos para serem usados em vários módulos: o módulo Http, com o objeto HttpCodes, o qual, conforme dito previamente, possui como atributos os códigos HTTP usados no projeto. O objeto é exportado pelo módulo Http.ts e o módulo testModels, o qual gera um user único para os testes automatizados.</p>
<h3>types</h3>
<p>Sobrescreve o módulo Express de modo a colocar a propriedade userId. Possui o módulo express.d.ts.</p>
<h3>github/workflows</h3>
<p>Possui o ci.yml, o qual guarda as instruções para CI/CD.</p>
<h3>prisma</h3>
<p>Corresponde à pasta dedicada ao schema e às migrations do banco de dados.</p>
<h2>Testes automatizados</h2>
<p>Esta aplicação utiliza o módulo Jest. Ela possui testes unitários específicos para cada função do controller. Os testes dos controllers não os testam somente, mas também as routes e requisições. Os testes são guardados dentro da pasta tests, a qual é subpasta da pasta controllers.</p>
<h3>Os edge cases</h3>
<p>Conforme dito antes, a aplicação funciona baseada no Design Defensivo, e isso inclui os chamados "edge cases", sob os quais há um controle sobre todos os erros de requisição possíveis: os testes para edge cases induzem as funções propositalmente ao erro para verificar se os tais erros geram as requisições corretas. São feitos inúmeros testes para uma mesma função, de modo a cobrir o máximo de erros possíveis. Cada teste é documentado claramente por meio de comentários e descrições concisas.</p>
<h2>Como executar</h2>
<p>São necessários passos específicos para executar a aplicação:</p>
<ol>
    <li><h3>Clonando o repositório</h3></li>
    <p>Crie uma pasta específica para o projeto:</p>
    <pre>
        <code>mkdir PostPoint</code>
    </pre>
    <p>E em seguida:</p>
    <pre>
        <code>cd PostPoint</code>
    </pre>
    <li><h3>Crie um arquivo .env</h3></li>
    <p>A aplicação funciona por meio de variáveis de ambiente. Ela possui duas variáveis: <pre><code>DATABASE_URL</code></pre> e <pre><code>JWT_SECRET</code></pre>. Você precisa definir primeiro o DATABASE_URL, o qual é essencial para todo o funcionamento das APIs.</p>
    <p>Primeiro de tudo, crie um banco de dados PostgreSQL por meio do DBeaver ou por meio de algum servidor online, como o <a href="https://supabase.com">Supabase</a> e o <a href="neon.com">Neon</a></p>
    <p>Segundo, copie o Database Connection String, o qual será algo parecido com: </p>
    <pre>
        <code>postgresql://username:password@hostname:5432/database_name?sslmode=require</code>
    </pre>
    <p>E em seguida defina a JWT_SECRET, que poderá ser algo parecido com: </p>
    <pre>
        <code>senha_super_secreta</code>
    </pre>
    <li><h3>Execute o container Docker</h3></li>
    <p>Construa primeiro a imagem Docker: </p>
    <pre>
        <code>docker build -t postpoint-api</code>
    </pre>
    <p>ou, caso haja algum erro de permissão (caso você esteja no Linux): </p>
    <pre>
        <code>sudo docker build -t postpoint-api</code>
    </pre>
    <p>E em seguida execute a imagem: </p>
    <pre>
        <code>docker run -p 3000:3000 postpoint-api</code>
    </pre>
    <p>Ou, para o mesmo caso anterior: </p>
    <pre>
        <code>sudo docker run -p 3000:3000 postpoint-api</code>
    </pre>
    <p>E a API poderá ser executada no: <a href="http://localhost:3000">http://localhost:3000</a></p>
    <li><h3>Executando manualmente (sem Docker)</h3></li>
    <p>Para a execução manual, é necessário ter pelo menos a versão 18 do Node.js. Tendo o node já instalado em seu computador, faça a instalação dos devidos módulos por meio do pacote npm, por meio desse comando:</p>
    <pre>
        <code>npm install --production</code>
    </pre>
    <p>Isso vai instalar todos os módulos necessários contidos no package.json. Logo depois, supondo que o arquivo .env já tenha sido criado, você precisa gerar o Prisma como uma garantia de funcionamento dos módulos (uma vez que o banco de dados está num PrismaClient gerado pelo Prisma):</p>
    <pre>
        <code>npx prisma generate</code>
    </pre>
    <p>Isso vai gerar o PrismaClient necessário para os CRUDs e os controllers.</p>
    <h4>Rodar testes automatizados</h4>
    <p>Para verificar o funcionamento dos testes automatizados, execute: </p>
    <pre>
        <code>npm test</code>
    </pre>
    <p>E, caso queira executar algum módulo específico, execute: </p>
    <pre>
        <code>npx jest ModuloEspecifico.test.ts</code>
    </pre>
    <p>(Substitua "ModuloEspecifico.test.ts" pelo caminho para o arquivo de teste desejado.)</p>
    <h4>Testando as APIs manualmente</h4>
    <p>Para executar a aplicação manualmente, execute: </p>
    <pre>
        <code>npm start</code>
    </pre>
    <p>E o endereço padrão para a execução das APIs é <a href="http://localhost:8000/">http://localhost:8000/</a> E a mensagem que você receberá no terminal será como: </p>
    <pre>
        <code style="color: green">Servidor inicializado com sucesso!</code>
    </pre>
    <p>As APIs podem ser testadas por meio do terminal ou mesmo por aplicações como <a href="https://www.postman.com/">o Postman</a>.</p>
    <p>Para se autenticar após o login (algo essencial para testar APIs que exigem autenticação), vá até o header "Authorization" e insira "Bearer {seu token}"</p>
    <p>Os endereços de APIs, baseados nas routes, são: </p>
    <table>
        <thead>
            <tr>
                <th>Método</th>
                <th>Rota</th>
                <th>Descrição</th>
                <th>Requisição ideal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>POST</td>
                <td>/api/user/new</td>
                <td>Cadastra novo(a) usuário(a)</td>
                <td>
                  {"nickname": "Fulano de tal", "email": "fulano@example.com", "password": "Senha de teste"}
                </td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/user/login</td>
                <td>Método para fazer login e gerar tokens de autenticação</td>
                <td>
                    {"nickname": "Fulano de tal", "password": "Senha de teste"}
                </td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/user/photo</td>
                <td>Permite ao(à) usuário(a) trocar sua foto de perfil (somente usuários autenticados)</td>
                <td>
                    {"url": "https://www.shutterstock.com/image-vector/inventory-icon-stock-product-catalog-600w-2707791441.jpg"}
                </td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/post/new</td>
                <td>Cria novos posts (somente usuários autenticados)</td>
                <td>
                   {"title": "Título de teste", "content": "Conteúdo de teste"}
                </td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/</td>
                <td>Lista todos os posts existentes no banco de dados</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/author/:authorId (Insira o número do ID de algum(a) usuário(a) no lugar de ":authorId")</td>
                <td>Lista todos os posts de um(a) determinado(a) autor(a)</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/post/:postId (substitua o ":postId" pelo número do ID de algum post que você criou)</td>
                <td>Atualiza um post (somente usuários autenticados e que sejam autores do post desejado)</td>
                <td>
                  {"title": "Novo título", "content": "Inserindo novo conteúdo"}
                </td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>/:postId (substitua o ":postId" pelo número do ID de algum post que você criou)</td>
                <td>Apaga um post (somente usuários autenticados e que sejam autores de um post)</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/post/comment/:postId/new (substitua o ":postId" pelo id de qualquer post, tenha você criado ou não)</td>
                <td>Cria um novo comentário em um determinado post (somente usuários autenticados)</td>
                <td>
                    {"content": "Conteúdo de teste"}
                </td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment</td>
                <td>Lista todos os comentários do blog</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment/:userId (substitua ":authorId" pelo id de um(a) usuário(a) qualquer)</td>
                <td>Lista os comentários de um(a) determinado(a) usuário(a).</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment/post/:postId (substitua ":postId" pelo id de algum dos posts presentes no banco de dados)</td>
                <td>Lista todos os comentários de um determinado post</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/post/comment/:postId/:commentId (substitua ":postId" pelo id de algum post, seja ele de sua autoria ou não, e substitua ":commentId", pelo id de um comentário obrigatoriamente de sua autoria).</td>
                <td>Atualiza o comentário de um determinado post (somente usuários autenticados e usuários que são autores do comentário)</td>
                <td>
                    {"content": "Novo conteúdo atualizado"}
                </td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>/api/post/comment/:postId/:commentId (substitua ":postId" pelo id de algum post, seja ele de sua autoria ou não, e substitua ":commentId", pelo id de um comentário obrigatoriamente de sua autoria).</td>
                <td>Apaga um comentário (apenas usuários autenticados e apenas usuários que são autores dos comentários)</td>
                <td>N/A</td>
            </tr>
        </tbody>
    </table>
</ol>
<h2>CI/CD</h2>
<p>A aplicação utiliza os princípios do CI/CD: Integração Contínua e Entrega Contínua, sob os quais a aplicação pode ser diretamente executada pelo servidor GitHub, de modo que você não precisa verificar o funcionamento da aplicação manualmente. As instruções necessárias estão no arquivo <code>ci.yml</code> e são necessários alguns ajustes caso queira testar as ferramentas do GitHub Actions: </p>
<ol>
    <li>Crie uma environment no GitHub chamada "My_ENV"</li>
    <li>Defina, dentro da environment, as variáveis "DATABASE_URL" e "JWT_SECRET" com os mesmos valores que seu arquivo .env</li>
    <li>Vá para a seção "Actions" do seu repositório e verifique se a aplicação funciona.</li>
    <li>Concluído! Você agora poderá testar manualmente, uma vez que o funcionamento já está garantido pelo GitHub</li>
</ol>
<h2>Contribuindo para o projeto</h2>
<ol>
<li>Faça um fork no repositório</li>
<li>Crie uma feature branch (`git checkout -b feature/amazing-feature`)</li>
<li>Execute os testes localmente (`npm test`) — todos os 44 testes vão passar</li>
<li>Faça uma Pull Request com uma descrição clara das mudanças</li>
</ol>
