

# Plano de Implementacao: Compliance, Seguranca e Blindagem de Interface

## Resumo

A maior parte da blindagem de erros e tratamento silencioso ja esta implementada no codigo atual (ErrorBoundary, suppressao em main.tsx, graceful failure em Processing.tsx). O foco principal sera adicionar o checkbox de Termos de Uso obrigatorio na tela de cadastro e atualizar o conteudo dos Termos com as clausulas juridicas solicitadas.

---

## 1. Checkbox de Termos de Uso no Sign Up

**Arquivo:** `src/pages/Auth.tsx`

- Adicionar estado `acceptedTerms` (boolean, default false)
- No formulario de cadastro (quando `!isLogin`), renderizar um Checkbox com label clicavel: "Li e aceito os Termos de Uso e Seguranca de Dados"
- A parte "Termos de Uso e Seguranca de Dados" sera um link que abre um Modal (Dialog) com o conteudo juridico
- O botao "Criar Conta" ficara `disabled` enquanto `acceptedTerms === false` (apenas no modo cadastro)
- Usar componentes ja existentes: `Checkbox` de `@/components/ui/checkbox` e `Dialog` de `@/components/ui/dialog`

## 2. Modal de Termos de Uso

**Arquivo:** `src/pages/Auth.tsx` (inline no mesmo componente)

O modal contera tres secoes:

1. **Natureza do Servico** -- Ferramenta de autoconhecimento via IA, nao substitui tratamento medico ou psicologico.
2. **Armazenamento** -- Dados processados e armazenados em infraestrutura de nuvem segura (PostgreSQL criptografado).
3. **Isencao de Responsabilidade** -- O usuario aceita que o A.X.I.O. se isenta de responsabilidade civil ou criminal em casos de invasoes ciberneticas em larga escala nos provedores de infraestrutura ou ma custodia de senhas pelo usuario.

## 3. Atualizacao da Pagina de Termos

**Arquivo:** `src/pages/Terms.tsx`

- Atualizar o conteudo para incluir as tres clausulas acima de forma mais detalhada (Natureza do Servico, Armazenamento, Isencao de Responsabilidade), mantendo as secoes ja existentes.

## 4. Verificacao da Blindagem de Interface (ja implementado)

Os seguintes mecanismos ja estao ativos e serao mantidos sem alteracao:

- **main.tsx:** Supressao de `error` e `unhandledrejection` para eliminar overlay preto do Vite
- **ErrorBoundary.tsx:** Captura erros React e exibe tela customizada com circulo vermelho, titulo "Diagnostico Interrompido" e mensagem correta
- **Processing.tsx:** Tratamento silencioso (graceful failure) em todos os cenarios de falha, com limpeza de sessionStorage e redirecionamento sem renderizar diagnosticos invalidos
- O botao "Tentar Novamente" ja limpa o estado e redireciona para `/recording?area=X`

Nenhuma alteracao necessaria nesses arquivos.

---

## Detalhes Tecnicos

### Alteracoes em Auth.tsx:
```
- import { Checkbox } from "@/components/ui/checkbox"
- import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
- Estado: const [acceptedTerms, setAcceptedTerms] = useState(false)
- Estado: const [termsOpen, setTermsOpen] = useState(false)
- Reset acceptedTerms ao alternar isLogin
- Checkbox + label entre campo senha e botao submit (apenas modo cadastro)
- Dialog com conteudo juridico das 3 clausulas
- Botao disabled={loading || (!isLogin && !acceptedTerms)}
```

### Arquivos modificados:
1. `src/pages/Auth.tsx` -- Checkbox + Modal de Termos
2. `src/pages/Terms.tsx` -- Conteudo juridico atualizado

### Arquivos NAO modificados (ja corretos):
- `src/main.tsx` -- Supressao de overlays ja ativa
- `src/components/ErrorBoundary.tsx` -- Tela de erro customizada ja implementada
- `src/pages/Processing.tsx` -- Graceful failure ja implementado
- Edge Functions -- Logica Sentinela de validacao de foco ja ativa

