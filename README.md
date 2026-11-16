# The Witch — v3 · Luthor Corporation Historical Archives

Esta versão estabelece o site como parte oficial da **Luthor Corporation** e redesenha a apresentação do livro.

## Identidade
- assinatura: Luthor Corporation · Historical Archives
- divisão editorial: Luthor Corporation Editions
- o dossiê de Letícia Luthor continua sendo o centro da experiência

## Livro
- nova capa premium com retrato integrado
- mockup 3D mais realista
- selo e assinatura editorial LC
- lombada redesenhada
- cards das edições com miniaturas próprias
- edição de colecionador com certificado editorial
- página de compra preservada como demonstração estática

## Loja (catálogo e compras)
Inspirada no protótipo Penpot da boutique: paleta ameixa, botões dourados e confirmação em verde.
- catálogo com três livros (The Witch, The Matriarch, The Painter) e dossiês em restauração
- página de produto com escolha de edição e quantidade
- carrinho com endereço de envio, frete fixo de € 3,60 e confirmação do pedido
- perfil com endereço salvo e histórico de pedidos
- login e cadastro (`login.html`): perfil e pedidos exigem conta; o carrinho pede login antes de enviar o pedido
- retratos e capas exportados do Penpot ficam em `imagens/`
- carrinho, contas, pedidos e perfil ficam no `localStorage` do navegador; nenhuma cobrança real é feita
- as senhas são guardadas como hash SHA-256 com sal, mas, por ser um site estático sem servidor, o login é apenas demonstrativo e não protege dados de verdade
- para adicionar um livro, inclua um objeto em `BOOKS` no `loja.js`; `portrait` e `coverImage` aceitam o caminho de uma imagem (sem elas, aparecem o monograma e a capa em CSS)

## Arquivos
- `index.html` — arquivo histórico
- `imagens.html` — coleção visual
- `livro.html` — publicação e boutique editorial
- `catalogo.html` — catálogo de livros
- `produto.html?livro=<id>` — página de cada livro
- `carrinho.html` — carrinho e envio
- `pedido.html` — pedido realizado
- `perfil.html` — perfil e pedidos
- `login.html` — entrar e criar conta
- `imagens/` — retratos, capas e ornamento do Penpot
- `style.css` — identidade e layout
- `loja.css` — estilos da loja
- `script.js` — interações
- `loja.js` — dados dos livros, carrinho e pedidos
