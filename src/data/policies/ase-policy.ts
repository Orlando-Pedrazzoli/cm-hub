export const ASE_POLICY = `
# Adult Sexual Exploitation (ASE)

## Definição
Reconhecemos a importância dos nossos serviços como um lugar para discutir e chamar a atenção para a violência e exploração sexual. Criamos espaço para esta conversa e promovemos um ambiente seguro, permitindo que vítimas partilhem suas experiências, mas removemos conteúdo que represente, ameace ou promova violência sexual, agressão sexual ou exploração sexual.

Removemos conteúdo que exiba, defenda ou coordene atos sexuais com partes não consentidoras. Se tomarmos conhecimento de conteúdo que ameace ou defenda violação, podemos desativar a conta e trabalhar com as autoridades.

Para proteger vítimas e sobreviventes, removemos imagens que retratam incidentes de violência sexual e imagens íntimas partilhadas sem o consentimento da(s) pessoa(s) retratada(s).

---

## Subcategorias Principais

### 1. Toque Sexual Não Consensual (NCST - Non-Consensual Sexual Touching)
### 2. Sextortion (Extorsão Sexual)
### 3. Imagens Íntimas Não Consensuais (NCII - Non-Consensual Intimate Imagery)
### 4. Outra Exploração Sexual (Creepshots, Necrofilia, Despimento Forçado)

---

## Hierarquia de Violações (Ordem de Prioridade)

1. NCST Ameaça de Violação Credível → **Escalate**
2. NCII Sextortion → **Label**
3. NCII Harassment → **Label**
4. NCII Sensacionalista → **Label**
5. NCII Serviços → **Label**
6. NCST Ameaça de Violação → **Label**
7. NCST Imagem → **Label**
8. NCST Texto → **Label**
9. NCST Identificação de Vítimas → **Label**
10. NCST Sensibilização → **Label**
11. Creepshots → **Label**
12. Despimento Forçado ou Necrofilia → **Label**

---

## 1. TOQUE SEXUAL NÃO CONSENSUAL (NCST)

### Definição
Qualquer forma de atividade sexual explícita, implícita ou outra atividade sexual ou toque sexual que ocorra sem consentimento (como violação, abuso ou toque de partes do corpo sexualizadas).

### Indicadores de Falta de Consentimento:
- Expressões verbais ("não", "para")
- Gestos físicos (empurrar, bater no agressor)
- Pessoa inconsciente, fortemente drogada ou intoxicada
- Alguém diz que a atividade sexual foi indesejada
- Alguém chama a atividade de violação ou agressão sexual

### Subcategorias e Ações:

| Tipo | Contexto | Ação |
|------|----------|------|
| Imagem de NCST | Qualquer contexto (exceto arte com legenda neutra/condenatória) | **Label** |
| Declarações para partilhar/oferecer/pedir imagem NCST | - | **Label** |
| Narrativas detalhadas de NCST | Vítima/sobrevivente ou terceiro em apoio | **Label** |
| Narrativas detalhadas de NCST | Qualquer outro contexto | **Label** |
| Defesa ou ameaça de cometer NCST | - | **Label** |
| Admissão de participação em NCST | - | **Label** |
| Identificar vítima de agressão sexual | Com match de nome/rosto com denunciante | **Label** |
| Troçar de vítimas/conceito de NCST | - | **Label** |

### Ameaça de Violação Potencialmente Credível → **ESCALATE**

**Critérios de Escalação:**
Declaração de intenção OU chamada à ação OU admissão de + violação + alvo + QUALQUER UM dos seguintes:
- Localização
- Timing específico
- Armamento
- Qualquer outra forma de violência de alta severidade

**Exemplos de Ameaça de Violação (Label):**
- "Vou violar [alvo]"
- "Viola [alvo]"
- "Vamos violar [alvo]"
- "Espero que [alvo] seja violada"
- "Quero drogar [alvo] e tocar-lhe no rabo"

---

## 2. SEXTORTION (Extorsão Sexual)

### Definição
Conteúdo que tenta explorar adultos através de coerção de dinheiro, favores ou imagens íntimas com ameaças de expor imagens íntimas ou informação íntima.

### Tipos de Sextortion:

#### A. Sextortion Financeira
Ameaçar partilhar imagens/informação íntima em troca de ganhos financeiros.
- "Envia-me 10.000€ ou partilho os teus nudes"
- "Envia o dinheiro pelo Western Union ou envio os teus nudes à tua família"

#### B. Sextortion Baseada em Favores
Ameaçar partilhar em troca de favores (sexo, desbloquear, reiniciar relacionamento).
- "Desbloqueia-me ou partilho os teus nudes"
- "Encontra-te comigo hoje ou envio os teus nudes à tua família"
- "É melhor teres sexo comigo se não queres o teu vídeo de sexo na internet"

#### C. Sextortion Baseada em Conteúdo
Ameaçar partilhar em troca de mais imagens íntimas.
- "Envia-me uma foto dos teus seios ou publico os teus nudes online"
- "Envia-me um vídeo teu a despires-te se não queres que os teus pais vejam os teus nudes"

### Ação: **Label** para todas as subcategorias

---

## 3. IMAGENS ÍNTIMAS NÃO CONSENSUAIS (NCII)

### Definição de Imagem Íntima
Imagem de uma ou mais pessoas (incluindo manipulada - deepfake, photoshop) que contém:
- Nudez (incluindo genitais)
- Quase nudez
- Pessoas em atividade sexual
- Pessoas em pose sexualmente sugestiva
- Foco em partes do corpo sexualizadas

### Definição de Informação Íntima
- Conversas sexuais privadas
- Linguagem expondo detalhes de atividades sexuais
- Alegações sobre atividade sexual, envolvimento romântico, orientação sexual ou identidade de género

### Indicadores de Falta de Consentimento:
- Contexto vingativo (legenda, comentários, título da página)
- Fontes independentes (cobertura mediática, registos policiais)
- Match de rosto entre denunciante e PDITI
- Match de nome entre denunciante e PDITI

### Subcategorias NCII:

#### A. NCII Harassment (Assédio)
| Critério | Ação |
|----------|------|
| Imagem íntima + cenário privado + contexto vingativo | **Label** |
| Imagem íntima + cenário privado + match rosto/nome | **Label** |
| Ameaça de partilhar imagem íntima | **Label** |
| Conversa sexual privada + alvo identificado + contexto vingativo | **Label** |
| NCII viral + contexto vingativo | **Label** |
| Colagem de múltiplas imagens íntimas + contexto vingativo | **Label** |

**Contexto Vingativo inclui:**
- Expressão de desprezo, nojo, troça ou humilhação
- Ataques através de termos depreciativos relacionados com atividade sexual
- Ataques baseados em experiências de agressão sexual
- Alegações sobre atividade sexual, orientação sexual, identidade de género
- Alegações sobre ISTs
- Comparação a animais/insetos considerados inferiores
- Ataques através de descrições físicas negativas

#### B. NCII Sensacionalista
| Critério | Ação |
|----------|------|
| Imagem íntima + figura pública | **Label** |
| Imagem íntima + falta de consentimento confirmada por conhecimento de mercado | **Label** |
| Colagem 3+ imagens de diferentes PDITIs SEM alvo identificado | **Label** |
| Imagem íntima + legendas sensacionalistas | **Label** |
| Oferecer/pedir/ameaçar partilhar para fins sensacionalistas | **Label** |

**Legendas Sensacionalistas (exemplos):**
- "OMG, o que é isto? vê o vídeo de sexo antes que desapareça"
- "Quem tem o escândalo do sex tape que está a viralizar?"
- "Não vais acreditar. Fotos de CELEBRIDADE totalmente nua"

#### C. NCII Serviços
Serviços, aplicações ou instruções que promovem, ameaçam partilhar ou oferecem criar NCII não real (deepfakes).

**Apps NCII Violadoras (lista não exaustiva):**
AI Clothes Remover, Cloth Off, Deep Nudes, DeepNude AI, Nudify, Undress AI, Remove Clothes, Nude It Now, PornX AI, SoulGen, Undress Me, etc.

**Prompts de AI que violam:**
- "Imagina [pessoa específica] nua"
- "Remove as roupas da mulher nesta foto"

**NÃO viola:**
- Apps de trocar roupa sem nudificação
- Apps de amigo AI sem criação de NCII
- Prompts genéricos sem pessoa específica

---

## 4. OUTRA EXPLORAÇÃO SEXUAL

### A. Creepshots

**Definição:** Imagens íntimas tiradas sem conhecimento da PDITI + contexto de troça, sexualização ou revelação de identidade.

**Indicadores de imagem tirada sem conhecimento:**
- PDITI não olha/posa/interage com câmara
- Imagem através de janelas, portas, aberturas
- Imagem de CCTV ou câmara escondida
- Bordas de câmara parcialmente obscurecidas
- Imagem de média-longa distância com PDITI de costas

**Indicadores de intenção de troçar/sexualizar/identificar:**
- Gírias sexuais na legenda/overlay
- Linguagem sexualmente explícita
- Violações de B&H contra PDITI
- Alterações digitais que chamam atenção para parte sexualizada
- Legendas que revelam identidade
- Emojis sugestivos: 🤡🐷🤣🥴💀🍆🥒🤤🥵🍑👅💋💦👉👌✊🍌

### B. Despimento Forçado (Forced Stripping)

**Definição:** Remoção forçada de roupa por outra pessoa com intenção de humilhar ou envergonhar.

**Indicadores de Ação Forçada (pelo menos 1):**
- Resistência do alvo (gritar, empurrar, tentar vestir-se)
- Restrição física do alvo
- Alvo a chorar
- Roupa rasgada

**Exemplos de declarações violadoras:**
- "Vou arrancar-lhe essas roupas"
- "Vou despi-la em público pelo que ela fez"
- "[Alvo] devia ser despido/a"

**Nota:** Despimento Forçado + NCST = aplicar NCST

### C. Necrofilia

**Definição:** Atividade sexual entre pessoa(s) e cadáver(es).

**Viola:**
- Imagens/vídeos de necrofilia
- Declarações de intenção de necrofilia
- Chamadas à ação para necrofilia
- Defesa de necrofilia
- Admissão de participação

**Exceção:** Em mercados onde termos de necrofilia são usados como expressões figurativas profanas (ex: "Vou f*der o teu cadáver"), tratar como B&H - Comentário Sexualizado Grave.

---

## Glossário de Termos Críticos

### Cenário Privado
Locais onde não se espera que muitos membros do público estejam:
- Impossível determinar se foi tirada em local público (ex: close-up de genitais)
- Local fechado com poucas pessoas (residência, apartamento, carro, hotel, casa de banho, escritório, quarto)
- Local exterior mas "privado" pela natureza (ex: pessoas em ato sexual num carro estacionado)

### Conversa Sexual Privada
Imagem de conversa privada ou gravação áudio/vídeo onde nomes ou rostos são identificáveis e a conversa descreve excitação sexual ou qualquer atividade sexual.

### Imagem Comercial
Imagem produzida para media comercial ou pornografia. Tipicamente altamente estilizada, encenada ou editada profissionalmente.

### Troçar (Mock)
Tentativa de fazer piada, rir de, embaraçar ou degradar alguém. NÃO significa oferecer contra-opinião, refutar ou denunciar.

### Ameaça (Threat)
Declaração ou visual representando intenção, aspiração ou chamada para um ato:
- Declaração de intenção: "Vou violar [alvo]"
- Chamada à ação: "Viola [alvo]"
- Defesa: "[Alvo] devia ser violado/a"
- Aspiracional: "Espero que [alvo] seja violado/a"
- Condicional: "Vou violar [alvo] se ele olhar para mim outra vez"

---

## Quando É Violação

### SEMPRE Label:
- Qualquer imagem de NCST (exceto arte de pessoas não reais com legenda neutra/condenatória)
- Declarações de intenção, chamadas à ação, defesa ou admissão de NCST
- Sextortion (financeira, favores ou conteúdo)
- NCII com contexto vingativo, match rosto/nome, ou sensacionalista
- Serviços/apps de criação de NCII
- Creepshots com contexto de troça/sexualização/identificação
- Despimento forçado com indicadores de ação forçada
- Necrofilia (imagens ou declarações)
- Troçar de vítimas de NCST/agressão sexual
- Identificar vítimas de agressão sexual (com match de denunciante)
- Solicitar ou oferecer imagens NCII/NCST

### SEMPRE Escalate:
- Ameaça de violação potencialmente credível (intenção + alvo + localização/timing/armamento/violência alta severidade)

---

## Quando NÃO É Violação (Exceções)

### Permitido (No Action ou context-dependent):
- Arte do mundo real de pessoas NÃO REAIS com legenda neutra ou condenatória
- Narrativas de NCST partilhadas por vítima/sobrevivente ou terceiro em apoio para condenação/sensibilização
- Reportagem noticiosa sobre NCST/ASE para sensibilização
- Imagens comerciais sem indicadores de falta de consentimento
- NCII partilhado para condenar o ato (delete content only, não disable user)

### NÃO é NCST:
- "Cuidado com a violação" (declaração geral)
- "Quero tocar no teu rabo" (sem sinais de não consentimento)
- "Quero ser violado/a" (há consentimento)
- "Quem me dera que ela me violasse"

---

## Exemplos de Violação (Descrições para Análise de Texto)

### NCST:
- "Vídeo mostra homem a tocar mulher inconsciente nas partes íntimas"
- "Imagem mostra pessoa a ser agarrada enquanto diz 'não' e empurra"
- "Vou violar a tua irmã amanhã à noite"
- "Ela merecia ser violada"
- "Eu violo regularmente"
- "Haha, a violação nem é assim tão má"

### Sextortion:
- "Envia-me 500€ ou mando os teus nudes para toda a gente"
- "Volta para mim ou toda a gente vê as tuas fotos"
- "Manda-me mais nudes ou publico os que já tenho"
- "Tens 5 minutos para me enviar dinheiro pelo PayPal"
- "Screenshot de lista de amigos + 'Vou enviar para todos eles'"

### NCII Harassment:
- "Esta puta mandou-me isto, vejam todos" + imagem íntima
- "Foto nua da minha ex" + match de nome/rosto com denunciante
- "Vou expor esta vadia" + imagem íntima
- "Olhem para esta nojenta" + screenshot de conversa sexual

### NCII Sensacionalista:
- "Vazou! Sex tape de [celebridade]! Vejam antes que apaguem!"
- "Quem tem o pack da [pessoa pública]? DM"
- Colagem de 5 mulheres nuas diferentes sem contexto vingativo específico

### NCII Serviços:
- "Usa esta app para ver qualquer pessoa nua - Clothoff"
- "Queres fazer nudes das tuas amigas? DM para desconto"
- "Remove as roupas de qualquer foto com esta AI"
- Prompt: "Imagina a presidente da câmara de Lisboa nua"

### Creepshots:
- "Olhem para o rabo desta no metro 🤤🍑" + foto de trás sem conhecimento
- "Upskirt da minha professora" + imagem por baixo da saia
- Foto através de janela de casa de banho + "apanhei-a!"

### Despimento Forçado:
- "Vídeo mostra grupo a arrancar roupa de mulher enquanto ela grita"
- "Vou rasgar-lhe a roupa toda em público"
- "Ela merece ser despida à força"

### Necrofilia:
- "Imagem de pessoa em ato sexual com corpo sem vida"
- "Vou f*der aquele cadáver" (quando NÃO é expressão figurativa cultural)
- "Devíamos todos participar em necrofilia"

---

## Exemplos de NÃO Violação (Descrições para Análise de Texto)

### Contexto de Sensibilização/Condenação:
- "Isto é horrível. Imagem de agressão sexual que está a circular - precisamos denunciar"
- "A minha história de sobrevivente: fui violada há 5 anos..."
- "Alguém está a partilhar os meus nudes sem consentimento. Isto é crime."
- "Reportagem: aumento de casos de sextortion afeta jovens"

### Arte com Legenda Neutra/Condenatória:
- "Obra de arte que retrata violência sexual na guerra - exposição no museu"
- "Escultura que denuncia agressão sexual - artista explica significado"

### Declarações Gerais (sem alvo específico):
- "A violação é um crime horrível"
- "Cuidado com predadores online"
- "Reportar casos de agressão sexual às autoridades"

### Imagens Comerciais sem Indicadores NCII:
- Pornografia comercial profissional
- Nude artístico em revista publicada

### Não Qualifica como NCST:
- "Quero tocar-te" (sem indicadores de não consentimento)
- "Beijamos-nos apaixonadamente" (consensual)

---

## Keywords/Termos Chave

### Português - NCST:
violação, violar, violador, estupro, estuprar, abuso sexual, agressão sexual, abusador, molestação, molestar, assédio sexual, tocar sem consentimento, forçar sexualmente, sexo forçado, não consensual, sem consentimento, ela disse não, forçou-a, drogar para abusar, inconsciente + sexo, "merece ser violada", "devia ser violado"

### Português - Sextortion:
extorsão sexual, chantagem nude, chantagem sexual, "manda dinheiro ou", "pago ou partilho", "envia mais fotos ou", "volta para mim ou exponho", western union, paypal, pix, mbway, transferência + nudes, "vou expor", "vou partilhar com todos", "5 minutos para decidir", screenshot amigos + ameaça

### Português - NCII:
imagem íntima, foto íntima, nude vazado, nudes vazados, pack vazado, leak, leaked, exposed, expor nudes, revenge porn, pornografia de vingança, sem autorização, sem consentimento, "olhem para esta", "vejam o que ela mandou", "ex namorada/o nua/o", "apanhei foto dela", deep fake nude, nudificar, deepnude, clothoff, undress ai, "remove roupas"

### Português - Creepshots:
creepshot, upskirt, por baixo da saia, foto escondida, foto sem saber, foto às escondidas, voyeur, espirar, filmou sem saber, câmara escondida, apanhei foto, "olhem para o rabo", foto no metro, foto na praia, sem conhecimento

### Português - Despimento Forçado:
despir à força, arrancar roupa, rasgar roupa, strip forçado, humilhar despindo, "vou tirar-lhe a roupa", roupa rasgada + choro, forçar a despir

### Português - Necrofilia:
necrofilia, sexo com cadáver, sexo com morto, corpo sem vida + sexual

### Inglês - Geral:
rape, rapist, sexual assault, sexual abuse, molestation, non-consensual, without consent, forced sex, sextortion, blackmail nudes, revenge porn, leaked nudes, exposed, intimate imagery, NCII, NCST, creepshot, upskirt, voyeur, forced stripping, necrophilia, deepfake nude, nudify, clothoff, undress ai, "send money or", "I'll expose you", "share with everyone"

### Emojis Indicadores de Intenção (Creepshots/NCII):
🤡🐷🤣🥴💀🍆🥒🤤🥵🍑👅💋💦👉👌👈✊🐍🌭🍌🌋

### Apps/Serviços NCII (Termos de Pesquisa):
clothoff, nudify, undress ai, deepnude, remove clothes, nude it now, pornx ai, soulgen, undress me, ai nudes, deep strip, delete clothes, erase clothes, pornworksai, nude fusion, crushmate, crushai
`;

export default ASE_POLICY;
