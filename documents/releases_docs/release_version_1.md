# Versão 1.0 - Emeg System

Este release marca o lançamento da **primeira versão** dos sistemas que compõem o **Emeg System**, desenvolvido para atender às necessidades da empresa **EMEG Guindaste**.

## Sistemas Incluídos na Versão 1.0:

### 1. **Hub Principal de Aplicações**
Um sistema simples que atua como um **hub central**, concentrando e organizando todos os sistemas desenvolvidos neste repositório em uma única página HTML. Ele facilita o acesso rápido e direto a cada um dos sistemas.

### 2. **Sistema de Criação de Orçamentos**
Ferramenta responsável por gerar orçamentos de serviços, utilizando informações previamente cadastradas dos clientes e seus equipamentos. 

**Principais Funcionalidades**:
- Entrada de dados no cabeçalho do orçamento (nome do cliente, equipamento, data de entrada, prazo estimado, condição de pagamento, e garantia).
- Adição de itens de serviços ou peças, com a possibilidade de editar, excluir ou ajustar as informações.
- Inclusão de observações no orçamento.
- Geração do orçamento com as opções de:
  - **Salvar como HTML**.
  - **Salvar como PDF**.
  - **Voltar para a página inicial**.

Este sistema está preparado para gerar documentos de forma rápida e prática, oferecendo flexibilidade na edição e manipulação dos dados.

### 3. **Sistema de Controle de Clientes**
Um sistema que permite a **adição, exclusão e edição de clientes e seus respectivos equipamentos**. Este módulo é crucial para o funcionamento do sistema de criação de orçamentos, pois os dados dos clientes são utilizados diretamente no processo de geração dos documentos.

**Principais Funcionalidades**:
- Manipulação ilimitada dos dados de clientes.
- Integração do backend com o **Render** e uso da **API do GitHub** para armazenar e atualizar os dados no arquivo `clients_equipaments.json` no GitHub.
- O sistema garante que os dados dos clientes estejam sempre disponíveis e atualizados para o uso nos orçamentos.

## Considerações Finais
Esta versão marca o início de uma plataforma robusta para gestão de serviços e clientes. Apesar de estar totalmente funcional, os sistemas passarão por testes contínuos para garantir a estabilidade e adequação às necessidades operacionais da empresa. 

Erros ou falhas podem ocorrer, e esperamos contar com feedbacks para aprimorar o sistema nas próximas versões.

---

### Em Desenvolvimento para Próximas Versões:
- **Controle de Estoque**.
- **Controle de Funcionários**.
- **Tabela de Preços**.


---

Publicado em: 08/10/2024
