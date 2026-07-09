[![CI/CD](https://github.com/ProgramasNS/PostPoint/actions/workflows/ci.yml/badge.svg)](https://github.com/ProgramasNS/PostPoint/actions/workflows/ci.yml)
<h1>PostPoint</h1>
<h2>What is PostPoint?</h2>
<p>A set of REST APIs for a blog developed mainly in the TypeScript programming language.</p>
<h2>Technologies used</h2>
<ul>
    <li><strong>Express.js:</strong> Main technology, used for creating APIs and handling requests. It is one of the most modern and robust frameworks for building back-end applications;</li>
    <li><strong>Prisma:</strong> The most popular ORM in the back-end market. It allows the creation of models through the <code>schema.prisma</code> file itself and is directly responsible for table creation and database interactions.</li>
    <li><strong>PostgreSQL:</strong> One of the most popular DBMSs (Database Management Systems) based on the SQL language. It is the application's database itself, which interacts directly with Prisma.</li>
    <li><strong>Jest:</strong> The main tool responsible for automated tests, which ensure constant software quality and protection against unexpected bugs.</li>
    <li><strong>Docker:</strong> Responsible for application containerization, allowing it to run on any device via a Dockerfile.</li>
    <li><strong>BCrypt:</strong> Responsible for encrypting passwords sent in each request.</li>
    <li><strong>Json Web Token (JWT):</strong> The main tool responsible for generating tokens for user authentication. It works via a secret key, which generates a token after user login.</li>
</ul>
<h2>Code Standardization</h2>
<p>The code for this project was based on the principles of <strong>Defensive Programming</strong>: each request of each API anticipates several possible failures, such as the omission of mandatory data in the request and the insertion of invalid data. In addition, the code is designed to be easy to read and understand, with comments clarifying several important points about the code.</p>
<p>Furthermore, the code is made to be practical and straightforward: The HttpCodes object, for example, replaces magic numbers when defining the <i>status code</i> of each response. The code is also entirely composed of arrow functions, which facilitate export and code readability.</p>
<h2>The Models</h2>
<p>The application models are defined by Prisma through the <code>schema.prisma</code> file. The schema has three models, with each corresponding to a database table. They are:</p>
<h3>users</h3>
<p>This model corresponds to the users of the application. It has the following properties: </p>
<ul>
    <li><strong>id:</strong> Unique property automatically inserted after a user is created via registration;</li>
    <li><strong>nickname:</strong> Unique property. It is the username of each user, being a mandatory property in both registration and login.</li>
    <li><strong>email:</strong> Unique property. It is the email corresponding to each user. It is mandatory for registration but optional for login.</li>
    <li><strong>password:</strong> Corresponds to the encrypted password of each user. It is mandatory for both registration and login.</li>
    <li><strong>profilePic:</strong> Optional property. Corresponds to the URL of the user's profile picture.</li>
    <li><strong>posts:</strong> Corresponds to the user's posts.</li>
    <li><strong>comments:</strong> Corresponds to the user's comments.</li>
</ul>
<h3>posts</h3>
<p>This model corresponds to the posts belonging to the blog.</p>
<ul>
    <li><strong>id:</strong> Unique property automatically inserted with each new post creation.</li>
    <li><strong>title:</strong> Optional property. Corresponds to the post title, not necessarily unique. The default value is "Post sem título".</li>
    <li><strong>content:</strong> Mandatory property. Corresponds to the post content. It must contain at least 10 characters.</li>
    <li><strong>user_id:</strong> Corresponds to the id of the post creator. Automatically inserted with each post created by a user. This property is directly linked to the posts property of the users model.</li>
    <li><strong>users:</strong> Corresponds directly to the user who created the post.</li>
    <li><strong>createdAt:</strong> Corresponds to the creation date of a specific post, defined by default as the current date at the time of creation.</li>
    <li><strong>updatedAt:</strong> Corresponds to the update date of a specific post, also automatically defined as the current time during the update.</li>
    <li><strong>comments:</strong> Corresponds to the comments belonging to a specific post.</li>
</ul>
<h3>comments</h3>
<p>Corresponds to comments. Each comment must belong to a specific post.</p>
<ul>
    <li><strong>id:</strong> Unique property automatically inserted with each comment creation;</li>
    <li><strong>content:</strong> Mandatory property. Corresponds to the comment content, which must contain at least 10 characters;</li>
    <li><strong>user_id:</strong> Corresponds to the id of the comment creator. Automatically inserted after each comment creation.</li>
    <li><strong>post_id:</strong> Corresponds to the id of the post to which the comment belongs. Automatically inserted after each comment creation.</li>
    <li><strong>users:</strong> Corresponds directly to the user who created the comment.</li>
    <li><strong>posts:</strong> Corresponds directly to the post to which the comment belongs.</li>
</ul>
<h2>Project Structure</h2>
<p>The project uses the <strong>Model-View-Controller (MVC)</strong> pattern, whose APIs mainly utilize models and controllers. Regarding organization, the project is based on the principle of <strong>Separation of Concerns</strong>, one of the pillars of Clean Code, in which the most important parts of the project are split into different folders. These folders include:</p>
<h3>Controllers</h3>
<p>Responsible for requests made with the models. Among them are: </p>
<ol>
    <li><h4>UserController.ts</h4></li>
    <p>Corresponds to the controller for the users model. It includes the functions cadastrarUsuário (POST method, which registers a new user), login (also POST, which in addition to logging in generates a token for subsequent JWT authentications), and atualizarFoto (a PUT method that requires authentication). Required request bodies: {nickname, email, and password} for registration and {nickname, password} for login.</p>
    <li><h4>PostController.ts</h4></li>
    <p>Corresponds to the controller for the posts model. It features a complete CRUD and extra functions for specific cases. The POST method corresponds to the criarPost function, under which authentication is mandatory (and it even includes preventions for unauthenticated users); the GET method corresponds to the listarPosts and listarPostsPorUsuario functions (which has authorId as a parameter in the routes); the PUT method corresponds to the atualizarPost function, which requires authentication and that the authenticated user is the author of the post; the DELETE method corresponds to the excluirComentário function, which has the same requirements as the PUT method function.</p>
    <li><h4>CommentController.ts</h4></li>
    <p>Corresponds to the controller for the comments model. It features a complete CRUD and extra functions for specific cases. The POST method corresponds to the criarComentario function, which requires authentication; the GET method corresponds to the listarComentarios, listarComentariosPorUsuario (which has userId as a parameter in the routes), and listarComentariosPorPost (which has postId as a parameter in the routes) functions; the PUT method corresponds to the atualizarComentario function, which requires authentication and that the user is the author of the comment; the DELETE method corresponds to the excluirComentário function, with the same requirements as the PUT method function.</p>
</ol>
<h3>Middlewares</h3>
<p>Corresponds to the folder dedicated to token creation. It contains only the exported module verificarToken, which is responsible for generating and verifying JWT authentication.</p>
<h3>Routes</h3>
<p>Corresponds to the folder dedicated to routes, which map functions, methods, and define which functions require authentication. It contains the files: </p>
<ol>
    <li><strong>UserRoutes.ts:</strong> Defines routes and invokes UserController methods;</li>
    <li><strong>PostRoutes.ts:</strong> Defines routes and invokes PostController methods;</li>
    <li><strong>CommentRoutes.ts:</strong> Defines routes and invokes CommentController methods.</li>
    <p><strong>NOTE:</strong> For functions that require authentication, the "verificarToken" function was passed as a parameter to each POST, PUT, and DELETE method; for GET functions, authentication is absent.</p>
</ol>
<h3>db</h3>
<p>Corresponds to the folder dedicated to database instantiation, which is exported as PrismaClient by its two modules: Database.ts and TestsDatabase.ts. The PrismaClient from Database.ts is based on the schema generated by Prisma itself, and is the means by which the database is invoked in the code. TestsDatabase.ts is the specific PrismaClient for automated tests.</p>
<h3>objects</h3>
<p>Corresponds to the folder dedicated to universal objects, designed to be used across multiple modules: the Http module, with the HttpCodes object, which, as previously mentioned, has the HTTP codes used in the project as attributes. The object is exported by the Http.ts module, and the testModels module, which generates a unique user for automated tests.</p>
<h3>types</h3>
<p>Overrides the Express module to add the userId property. Contains the express.d.ts module.</p>
<h3>github/workflows</h3>
<p>Contains ci.yml, which stores instructions for CI/CD.</p>
<h3>prisma</h3>
<p>Corresponds to the folder dedicated to the database schema and migrations.</p>
<h2>Automated Tests</h2>
<p>This application uses the Jest module. It features specific unit tests for each controller function. The controller tests do not only test the controllers themselves, but also the routes and requests. The tests are stored inside the tests folder, which is a subfolder of the controllers folder.</p>
<h3>Edge Cases</h3>
<p>As previously mentioned, the application works based on Defensive Design, and this includes the so-called "edge cases", under which there is control over all possible request errors: edge case tests intentionally induce functions to fail to check if such errors generate the correct responses. Numerous tests are performed for the same function to cover as many errors as possible. Each test is clearly documented through comments and concise descriptions.</p>
<h2>How to Run</h2>
<p>Specific steps are required to run the application:</p>
<ol>
    <li><h3>Cloning the Repository</h3></li>
    <p>Create a specific folder for the project:</p>
    <pre>
        <code>mkdir PostPoint</code>
    </pre>
    <p>And then:</p>
    <pre>
        <code>cd PostPoint</code>
    </pre>
    <li><h3>Create a .env File</h3></li>
    <p>The application works through environment variables. It has two variables: <pre><code>DATABASE_URL</code></pre> and <pre><code>JWT_SECRET</code></pre>. You must first define DATABASE_URL, which is essential for the entire functioning of the APIs.</p>
    <p>First of all, create a PostgreSQL database using DBeaver or through an online server, such as <a href="https://supabase.com">Supabase</a> and <a href="neon.com">Neon</a></p>
    <p>Second, copy the Database Connection String, which will be something like: </p>
    <pre>
        <code>postgresql://username:password@hostname:5432/database_name?sslmode=require</code>
    </pre>
    <p>And then define the JWT_SECRET, which could be something like: </p>
    <pre>
        <code>super_secret_password</code>
    </pre>
    <li><h3>Run the Docker Container</h3></li>
    <p>First, build the Docker image: </p>
    <pre>
        <code>docker build -t postpoint-api</code>
    </pre>
    <p>or, if there is a permission error (if you are on Linux): </p>
    <pre>
        <code>sudo docker build -t postpoint-api</code>
    </pre>
    <p>And then run the image: </p>
    <pre>
        <code>docker run -p 3000:3000 postpoint-api</code>
    </pre>
    <p>Or, for the same case as above: </p>
    <pre>
        <code>sudo docker run -p 3000:3000 postpoint-api</code>
    </pre>
    <p>And the API can be executed at: <a href="http://localhost:3000">http://localhost:3000</a></p>
    <li><h3>Running Manually (Without Docker)</h3></li>
    <p>For manual execution, at least Node.js version 18 is required. Having Node already installed on your computer, install the necessary modules using the npm package manager with this command:</p>
    <pre>
        <code>npm install --production</code>
    </pre>
    <p>This will install all necessary modules contained in package.json. Right after, assuming the .env file has already been created, you need to generate Prisma as a guarantee for the modules to work (since the database is in a PrismaClient generated by Prisma):</p>
    <pre>
        <code>npx prisma generate</code>
    </pre>
    <p>This will generate the PrismaClient required for the CRUDs and controllers.</p>
    <h4>Run Automated Tests</h4>
    <p>To verify the functioning of the automated tests, run: </p>
    <pre>
        <code>npm test</code>
    </pre>
    <p>And, if you want to execute a specific module, run: </p>
    <pre>
        <code>npx jest SpecificModule.test.ts</code>
    </pre>
    <p>(Replace "SpecificModule.test.ts" with the path to the desired test file.)</p>
    <h4>Testing the APIs Manually</h4>
    <p>To run the application manually, run: </p>
    <pre>
        <code>npm start</code>
    </pre>
    <p>And the default address for executing the APIs is <a href="http://localhost:8000/">http://localhost:8000/</a> And the message you will receive in the terminal will be like: </p>
    <pre>
        <code style="color: green">Servidor inicializado com sucesso!</code>
    </pre>
    <p>The APIs can be tested through the terminal or even by applications like <a href="https://www.postman.com/">Postman</a>.</p>
    <p>To authenticate after login (essential for testing APIs that require authentication), go to the "Authorization" header and enter "Bearer {your token}"</p>
    <p>The API addresses, based on the routes, are: </p>
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>Route</th>
                <th>Description</th>
                <th>Ideal Request</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>POST</td>
                <td>/api/user/new</td>
                <td>Registers a new user</td>
                <td>
                  {"nickname": "Fulano de tal", "email": "fulano@example.com", "password": "Senha de teste"}
                </td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/user/login</td>
                <td>Method to log in and generate authentication tokens</td>
                <td>
                    {"nickname": "Fulano de tal", "password": "Senha de teste"}
                </td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/user/photo</td>
                <td>Allows the user to change their profile picture (authenticated users only)</td>
                <td>
                    {"url": "https://www.shutterstock.com/image-vector/inventory-icon-stock-product-catalog-600w-2707791441.jpg"}
                </td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/post/new</td>
                <td>Creates new posts (authenticated users only)</td>
                <td>
                   {"title": "Título de teste", "content": "Conteúdo de teste"}
                </td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/</td>
                <td>Lists all existing posts in the database</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/author/:authorId (Insert the ID number of a user instead of ":authorId")</td>
                <td>Lists all posts of a specific author</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/post/:postId (replace ":postId" with the ID number of a post you created)</td>
                <td>Updates a post (only authenticated users who are authors of the desired post)</td>
                <td>
                  {"title": "Novo título", "content": "Inserindo novo conteúdo"}
                </td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>/:postId (replace ":postId" with the ID number of a post you created)</td>
                <td>Deletes a post (only authenticated users who are authors of the post)</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/post/comment/:postId/new (replace ":postId" with the id of any post, whether you created it or not)</td>
                <td>Creates a new comment on a specific post (authenticated users only)</td>
                <td>
                    {"content": "Conteúdo de teste"}
                </td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment</td>
                <td>Lists all comments on the blog</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment/:userId (replace ":authorId" with the id of any user)</td>
                <td>Lists the comments of a specific user.</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/post/comment/post/:postId (replace ":postId" with the id of one of the posts present in the database)</td>
                <td>Lists all comments of a specific post</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>/api/post/comment/:postId/:commentId (replace ":postId" with the id of any post, whether owned by you or not, and replace ":commentId" with the id of a comment that must be authored by you).</td>
                <td>Updates the comment of a specific post (only authenticated users and users who are authors of the comment)</td>
                <td>
                    {"content": "Novo conteúdo atualizado"}
                </td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>/api/post/comment/:postId/:commentId (replace ":postId" with the id of any post, whether owned by you or not, and replace ":commentId" with the id of a comment that must be authored by you).</td>
                <td>Deletes a comment (only authenticated users and only users who are authors of the comments)</td>
                <td>N/A</td>
            </tr>
        </tbody>
    </table>
</ol>
<h2>CI/CD</h2>
<p>The application uses CI/CD principles: Continuous Integration and Continuous Delivery, under which the application can be directly executed by the GitHub server, so you do not need to check the application's operation manually. The necessary instructions are in the <code>ci.yml</code> file, and some adjustments are required if you want to test the GitHub Actions tools:</p>
<ol>
    <li>Create an environment in GitHub named "My_ENV"</li>
    <li>Define, within the environment, the variables "DATABASE_URL" and "JWT_SECRET" with the same values as your .env file</li>
    <li>Go to the "Actions" section of your repository and check if the application works.</li>
    <li>Done! You can now test manually, since the operation is already guaranteed by GitHub</li>
</ol>
<h2>Contributing</h2>
<ol>
<li>Fork the repository</li>
<li>Create a feature branch (`git checkout -b feature/amazing-feature`)</li>
<li>Run tests locally (`npm test`) — all 44 must pass</li>
<li>Open a Pull Request with a clear description of changes</li>
</ol>
