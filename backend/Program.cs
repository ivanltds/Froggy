// ============================================================================
// PROJETO UNIVERSITÁRIO: API de Autenticação com SQLite
// Disciplina: Desenvolvimento Web / Banco de Dados
// Propósito: Conectar Frontend estático ao Banco de Dados Relacional
// ============================================================================

using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------------------------------------------------------
// 1. CONFIGURAÇÃO DE CORS (Cross-Origin Resource Sharing)
// ----------------------------------------------------------------------------
// Necessário para que o navegador permita que o seu frontend (rodando em file://
// ou em outro servidor local como Live Server) se comunique com esta API C#.
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()   // Permite requisições de qualquer origem
              .AllowAnyMethod()   // Permite qualquer verbo (GET, POST, etc.)
              .AllowAnyHeader();  // Permite qualquer cabeçalho HTTP
    });
});

var app = builder.Build();

// Aplicar a política de CORS
app.UseCors("PermitirTudo");

// ----------------------------------------------------------------------------
// Servir arquivos estáticos da pasta raiz do workspace para suportar os caminhos originais
// ----------------------------------------------------------------------------
var caminhoWorkspace = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, ".."));

// 1. Suportar acessos diretos pela raiz (ex: http://localhost:5000/HTML/inicial.html)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(caminhoWorkspace),
    RequestPath = ""
});

// 2. Suportar os caminhos absolutos acadêmicos originais (ex: /2026.1/PIM/Site/CSS/inicial.css)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(caminhoWorkspace),
    RequestPath = "/2026.1/PIM/Site"
});

// ----------------------------------------------------------------------------
// 2. INICIALIZAÇÃO AUTOMÁTICA DO BANCO DE DADOS (SQLite)
// ----------------------------------------------------------------------------
// Para facilitar a vida e garantir que o projeto funcione de primeira em qualquer
// computador, esta rotina cria o arquivo do banco e a tabela caso não existam.
string connectionString = "Data Source=../banco/banco.db";
InicializarBancoDeDados(connectionString);

// ----------------------------------------------------------------------------
// 3. DEFINIÇÃO DA ROTA DE LOGIN (POST /api/login)
// ----------------------------------------------------------------------------
app.MapPost("/api/login", (LoginRequest request) =>
{
    // Validação inicial simples
    if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Senha))
    {
        return Results.BadRequest(new LoginResponse(false, "Usuário e senha devem ser preenchidos."));
    }

    try
    {
        // Abrindo conexão com o banco de dados SQLite
        using (var conexao = new SqliteConnection(connectionString))
        {
            conexao.Open();

            // QUERY PARAMETRIZADA: Essencial para segurança!
            // O uso de @Usuario e @Senha previne ataques de SQL Injection, impedindo
            // que strings maliciosas como "' OR '1'='1" enganem a nossa verificação.
            string sql = "SELECT COUNT(1) FROM Usuarios WHERE Usuario = @Usuario AND Senha = @Senha";

            using (var comando = new SqliteCommand(sql, conexao))
            {
                // Vinculando os dados recebidos pelo front de forma segura
                comando.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());
                comando.Parameters.AddWithValue("@Senha", request.Senha);

                // Executa a query e retorna o valor da primeira coluna (o COUNT(1))
                long resultado = (long)(comando.ExecuteScalar() ?? 0);

                if (resultado > 0)
                {
                    // Credenciais existem no banco! Retorna status 200 OK com sucesso
                    return Results.Ok(new LoginResponse(true, "Usuário autenticado com sucesso! Acesso liberado."));
                }
                else
                {
                    // Credenciais não encontradas. Retorna status 401 Não Autorizado
                    return Results.Json(new LoginResponse(false, "Usuário ou senha incorretos."), statusCode: 401);
                }
            }
        }
    }
    catch (Exception ex)
    {
        // Tratamento de erros caso o arquivo do banco ou o SQL falhe
        Console.WriteLine($"[ERRO NO BANCO]: {ex.Message}");
        return Results.Json(new LoginResponse(false, "Erro ao conectar com o banco de dados."), statusCode: 500);
    }
});

// ----------------------------------------------------------------------------
// 3.5. DEFINIÇÃO DA ROTA DE CADASTRO (POST /api/cadastro)
// ----------------------------------------------------------------------------
app.MapPost("/api/cadastro", (CadastroRequest request) =>
{
    // Validação inicial simples
    if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Senha))
    {
        return Results.BadRequest(new { mensagem = "Usuário e senha devem ser preenchidos." });
    }

    try
    {
        using (var conexao = new SqliteConnection(connectionString))
        {
            conexao.Open();

            // Verificar se o usuário já existe
            string sqlCheck = "SELECT COUNT(1) FROM Usuarios WHERE Usuario = @Usuario";
            using (var cmdCheck = new SqliteCommand(sqlCheck, conexao))
            {
                cmdCheck.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());
                long count = (long)(cmdCheck.ExecuteScalar() ?? 0);
                if (count > 0)
                {
                    return Results.Json(new { mensagem = "Este usuário já está cadastrado no banco SQL!" }, statusCode: 400);
                }
            }

            // Inserir o novo usuário na tabela SQLite
            string sqlInsert = "INSERT INTO Usuarios (Usuario, Senha) VALUES (@Usuario, @Senha)";
            using (var cmdInsert = new SqliteCommand(sqlInsert, conexao))
            {
                cmdInsert.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());
                cmdInsert.Parameters.AddWithValue("@Senha", request.Senha);
                cmdInsert.ExecuteNonQuery();
            }

            return Results.Ok(new { mensagem = "Cadastro realizado com sucesso no banco SQLite!" });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERRO NO BANCO DE CADASTRO]: {ex.Message}");
        return Results.Json(new { mensagem = "Erro ao cadastrar usuário no banco de dados." }, statusCode: 500);
    }
});

// ----------------------------------------------------------------------------
// 3.8. ROTA VISUAL: RECURSO ACADÊMICO PARA EXIBIR DADOS DO SQLITE NO PAINEL
// ----------------------------------------------------------------------------
app.MapGet("/api/banco/usuarios", () =>
{
    try
    {
        using (var conexao = new SqliteConnection(connectionString))
        {
            conexao.Open();
            string sql = "SELECT Id, Usuario FROM Usuarios ORDER BY Id ASC";
            var lista = new List<object>();

            using (var comando = new SqliteCommand(sql, conexao))
            {
                using (var leitor = comando.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(new { 
                            id = leitor.GetInt32(0), 
                            usuario = leitor.GetString(1) 
                        });
                    }
                }
            }
            return Results.Ok(lista);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERRO AO BUSCAR USUARIOS]: {ex.Message}");
        return Results.Json(new { mensagem = "Erro ao ler a tabela Usuarios do SQLite." }, statusCode: 500);
    }
});

// ----------------------------------------------------------------------------
// 3.9. CONSULTA DINÂMICA: RECURSO ACADÊMICO PARA EXECUTAR QUALQUER QUERY SQL
// ----------------------------------------------------------------------------
app.MapPost("/api/banco/executar", (ExecutarQueryRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Sql))
    {
        return Results.BadRequest(new { mensagem = "A query SQL não pode estar vazia." });
    }

    try
    {
        using (var conexao = new SqliteConnection(connectionString))
        {
            conexao.Open();
            string sqlUpper = request.Sql.Trim().ToUpper();

            using (var comando = new SqliteCommand(request.Sql, conexao))
            {
                // Se a query começa com SELECT, PRAGMA, EXPLAIN ou WITH, tratamos como consulta com dados de retorno
                if (sqlUpper.StartsWith("SELECT") || sqlUpper.StartsWith("PRAGMA") || sqlUpper.StartsWith("EXPLAIN") || sqlUpper.StartsWith("WITH"))
                {
                    var colunas = new List<string>();
                    var linhas = new List<Dictionary<string, object>>();

                    using (var leitor = comando.ExecuteReader())
                    {
                        int camposCount = leitor.FieldCount;
                        for (int i = 0; i < camposCount; i++)
                        {
                            colunas.Add(leitor.GetName(i));
                        }

                        while (leitor.Read())
                        {
                            var linha = new Dictionary<string, object>();
                            for (int i = 0; i < camposCount; i++)
                            {
                                var valor = leitor.GetValue(i);
                                linha[leitor.GetName(i)] = valor == DBNull.Value ? "NULL" : valor;
                            }
                            linhas.Add(linha);
                        }
                    }

                    return Results.Ok(new { 
                        tipo = "SELECT", 
                        colunas = colunas, 
                        linhas = linhas, 
                        mensagem = $"Sucesso! {linhas.Count} registros retornados." 
                    });
                }
                else
                {
                    // Comandos DDL ou DML de escrita (INSERT, UPDATE, DELETE, CREATE, DROP, etc.)
                    int linhasAfetadas = comando.ExecuteNonQuery();
                    return Results.Ok(new { 
                        tipo = "NON_QUERY", 
                        linhasAfetadas = linhasAfetadas, 
                        mensagem = $"Sucesso! Comando executado. Linhas afetadas: {linhasAfetadas}." 
                    });
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERRO DE QUERY SQLITE]: {ex.Message}");
        return Results.Json(new { erro = ex.Message }, statusCode: 400); // 400 com mensagem de erro amigável para exibir na tela
    }
});

// ----------------------------------------------------------------------------
// 5. FUNÇÃO DIDÁTICA DE INICIALIZAÇÃO DO BANCO
// ----------------------------------------------------------------------------
void InicializarBancoDeDados(string connString)
{
    try
    {
        // Certificar que a pasta do banco existe
        Directory.CreateDirectory("../banco");

        using (var conexao = new SqliteConnection(connString))
        {
            conexao.Open();

            // 1. Criar a Tabela Usuarios caso não exista (Schema)
            string schemaPath = "../banco/schema.sql";
            if (File.Exists(schemaPath))
            {
                string sqlSchema = File.ReadAllText(schemaPath);
                using (var cmd = new SqliteCommand(sqlSchema, conexao))
                {
                    cmd.ExecuteNonQuery();
                }
                Console.WriteLine("[BANCO]: Tabela 'Usuarios' verificada/criada com sucesso.");
            }

            // 2. Popular com dados iniciais se a tabela estiver vazia (Seed)
            string checkEmptySql = "SELECT COUNT(1) FROM Usuarios";
            long count = 0;
            using (var cmdCheck = new SqliteCommand(checkEmptySql, conexao))
            {
                count = (long)(cmdCheck.ExecuteScalar() ?? 0);
            }

            if (count == 0)
            {
                string seedPath = "../banco/seed.sql";
                if (File.Exists(seedPath))
                {
                    string sqlSeed = File.ReadAllText(seedPath);
                    using (var cmd = new SqliteCommand(sqlSeed, conexao))
                    {
                        cmd.ExecuteNonQuery();
                    }
                    Console.WriteLine("[BANCO]: Dados de teste carregados com sucesso (seed.sql).");
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERRO NA INICIALIZAÇÃO DO BANCO]: {ex.Message}");
    }
}

// Inicializar e rodar o servidor web na porta local 5000
app.Run("http://localhost:5000");

// ----------------------------------------------------------------------------
// 6. MODELOS DE DADOS (Records C#)
// ----------------------------------------------------------------------------
// Estruturas de dados simples (Records) para entrada e saída de dados.
// Colocados no final do arquivo de acordo com a regra de Top-Level Statements do C#.
public record LoginRequest(string Usuario, string Senha);
public record LoginResponse(bool Sucesso, string Mensagem);
public record CadastroRequest(string Usuario, string Senha);
public record ExecutarQueryRequest(string Sql);
