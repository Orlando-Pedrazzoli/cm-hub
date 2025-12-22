export const CSEAN_POLICY = `
# Child Sexual Exploitation, Abuse, and Nudity (CSEAN)

## Policy Rationale
Não permitimos conteúdo ou atividade que explore sexualmente ou coloque em perigo crianças. Quando tomamos conhecimento de aparente exploração infantil, reportamos ao National Center for Missing and Exploited Children (NCMEC), em conformidade com a lei aplicável. Sabemos que às vezes as pessoas partilham imagens de nudez dos seus próprios filhos com boas intenções; no entanto, geralmente removemos estas imagens devido ao potencial de abuso por outros e para ajudar a evitar a possibilidade de outras pessoas reutilizarem ou se apropriarem indevidamente das imagens.

**NOTA CRÍTICA:** Esta policy aplica-se a TODAS as crianças (qualquer indivíduo com menos de 18 anos), incluindo representações reais e não-reais (arte, desenhos, cartoons, conteúdo gerado por IA, personagens fictícios, bonecos, etc.).

## Exclusões da Policy
- Conteúdo que NÃO é CSAM:
  - Imagens médicas (contexto médico, erupções, inchaço anormal, recuperação de lesões)
  - Imagens de arte
  - Imagens de cartoon (ex: hentai) - podem violar outras policies
  - Banho, uso de banheiro ou troca de fraldas apropriados
  - Fotos religiosas ou culturais incluindo circuncisão masculina ou feminina/mutilação genital
  - Fotos de família sem elementos sexuais (ex: bebé na banheira, crianças a correr nuas ao ar livre com mangueira)
  - Imagens de abuso infantil não-sexual
  - Animal a morder genitais de criança (APENAS em vídeos - se foto, escalar)

---

## Faixas Etárias (Age Buckets)

| Categoria | Idade | Notas |
|-----------|-------|-------|
| **Fetos/Bebés (Fetuses/Babies)** | 0 - 1.5 anos | Se não conseguir ficar de pé = bebé |
| **Crianças Pequenas (Toddlers)** | 1.5 - <4 anos | Consegue ficar de pé mas claramente muito jovem |
| **Menores (Minors)** | 4 - <18 anos | Crianças mais velhas e adolescentes |

### Regras de Incerteza:
- Se incerto se adulto ou menor → Tratar como **menor**
- Se incerto se bebé ou toddler → Tratar como **bebé**
- Se incerto se toddler ou menor → Tratar como **menor**
- Se incerto se real ou não-real → Tratar como **real** (para fins de escalação)

### Determinação de Idade - Sinais Físicos:
**Para masculinos:**
- Considerar desenvolvimento muscular e largura dos ombros

**Para femininos:**
- Procurar ancas pequenas e não alargadas

**Para ambos os géneros:**
- Tamanho de braços/pernas/mãos/pés relativos a outros objetos na foto
- Arredondamento da face/falta de queixo ou linha da mandíbula
- Fotos tiradas em ambiente escolar (sala de aula, autocarro escolar, uniforme escolar)

### Hierarquia de Sinais de Idade (para IIC):
1. **Idade Confessada:** Idade consistente confessada pelo utilizador no thread de mensagens ou subject element
2. **Idade Potencial/Afinidade:** Estimativa de idade gerada no backend (inclui tag "Potential Minor")
3. **Idade Listada:** Idade listada no perfil do utilizador
4. **DOB Anterior:** Idade determinada por data de nascimento previamente listada

### Sinais de Idade - 5+ Sinais = Menor:
**Desenvolvimento Corporal Menor:**
- Ombros estreitos (tão estreitos ou mais estreitos que o tamanho da face)
- Subdesenvolvimento físico
- Arredondamento facial
- Mãos/pés pequenos relativamente ao corpo

**Cenário Menor:**
- Ambiente escolar visível
- Uniforme escolar
- Mochilas/material escolar
- Presença de outros menores aparentes

**Subject Elements Menor:**
- Admissão de idade no username/bio/display name
- Referência a série escolar (até 12º ano)
- Tag "Potential Minor" presente

---

## 1. EXPLORAÇÃO SEXUAL DE CRIANÇAS (Child Sexual Exploitation)

### 1.1 CSAM (Child Sexual Abuse Material) - ESCALATE

**Definição:** Qualquer representação visual de uma pessoa menor de 18 anos envolvida em conduta sexualmente explícita. Isto significa que qualquer imagem de uma criança envolvida em conduta sexualmente explícita é contraband ilegal.

**ESCALATE quando imagem retrata Menor Real (<18) em pelo menos 1 dos 3 cenários:**

#### Cenário 1: Relação Sexual (atual, implícita ou feita parecer)
- Genital a genital
- Genital a boca
- Genital a ânus
- Boca a ânus
- Manipulação manual de genitais com intenção de excitação sexual (cobrir, apontar ou puxar não é suficiente)
- **Masturbação:** Estimulação sexual dos próprios genitais (pode incluir mãos, dedos, objetos sexuais, objetos não-sexuais)
  - Pénis ereto + tocar = masturbação
  - Simplesmente tocar genitais (cobrir) NÃO é masturbação
- Fluido sexual presente (pelo menos uma pessoa nua/quase-nua + fluidos sexuais)
- Qualquer dos acima envolvendo animal
- Inserção de objeto estranho em genitais ou ânus
- Objeto sexual (ex: sex toy) colocado ou inserido na boca
- Relação sexual iminente aparente (ex: face de criança perto mas não tocando pénis excitado de adulto)
- Imagem editada/manipulada/gerada por IA que faz parecer que menor real está envolvido em atividade sexual

#### Cenário 2: Abuso Sadista Masoquista (S&M)
- Infligir dor ou restrições/amarras em contexto de fetiche para propósito sexual
- "Propósito sexual" é derivado do cenário na imagem (ex: ball gags, amarrado à cama)
- NÃO requer genitais visíveis nem atividade sexual presente
- NÃO confundir com abuso físico infantil (não é CSAM) onde propósito sexual não está claramente presente

#### Cenário 3: Genitais/Ânus Visíveis + 2 ou mais Elementos Sexuais:

**Genitais/Ânus Visíveis:**
- Nu ou parcialmente nu de forma que genitais ou ânus sejam visíveis
- NÃO se aplica a seios ou nádegas descobertos
- Roupa mal ajustada que destaca/delineia os órgãos genitais

**Elementos Sexuais (precisa 2+):**

1. **Foco em Genitais/Ânus:**
   - Imagem recortada em genitais/ânus
   - Gestos para direcionar foco (apontar ou enquadrar)
   - Genitais/ânus destacados com luz
   - Pernas ou joelhos intencionalmente afastados para chamar atenção à área genital
   - Despir roupa para expor genitais/ânus
   - Contorção para expor área genital
   - EXCLUIR: foco incidental em genitais/ânus

2. **Cenário Associado com Atividade Sexual:**
   - Locais como cama, sofá, chuveiro, banheira, tapete ou cobertor (mas NÃO praia/lago)
   - Presença de sex toys/adereços sexuais
   - Criança na presença de adulto(s) excitado(s)
   - NOTA: Precisa ver o suficiente do cenário para identificação definitiva

3. **Pose Sexualizada:**
   - Afastar a pele à volta dos genitais para os expor
   - Up-skirt shot de ângulo baixo
   - De quatro (mãos e joelhos)
   - Restrições sexuais (sem contexto S&M ou fetiche)

4. **Imagem Destinada a Provocar Resposta Sexual:**
   - Selfie com genitais visíveis
   - Excitação de criança ou adulto na imagem
   - Vestido com trajes sexualizados (tangas, lingerie, fishnets, trajes teatrais, fraldas em crianças acima da idade apropriada - max 4 anos)
   - Criança tocada inapropriadamente (seios vestidos ou nus tocados por outra pessoa ou objeto)
   - Fetishes retratando menores
   - Beijo de boca aberta com menor ou adulto
   - Razão primária é provocar resposta sexual

### 1.2 Outras Violações de Exploração Sexual de Crianças - LABEL

**Label para:**
- Imagens não-reais de exploração sexual infantil (cartoons, anime, hentai, arte digital, geradas por IA)
- Identificar ou ridicularizar alegada vítima de exploração sexual infantil
- Conteúdo que apoia/promove pedofilia (ex: MAP Pride, AAM Pride, MAP Supporter)
- Conteúdo de fetiche sexual envolvendo crianças
- Foco intencional em genitais ou genitais recortados que não atinge critérios de CSAM

### Elementos Indicando Atividade Sexual em Crianças:
- **Restrições/amarras:** cordas, correntes, algemas, lenços, fita adesiva
- **Abertura de genitais ou ânus**
- **Sinais de excitação:** ereção, humidade
- **Presença de adulto excitado**
- **Foco ou recorte em genitais:** ânus visível e/ou close-ups de nádegas totalmente nuas, incluindo levantar ambas as pernas para expor genitais
- **Traje sexualizado:** lingerie, fishnets, roupa de couro
- **Stripping:** movimento de roupa para expor seio parcial ou pele na área púbica
- **Presença de brinquedos sexuais ou uso de objetos para estimulação sexual**
- **Ambiente encenado:** numa cama, ou fotografado profissionalmente
- **Beijo de boca aberta com criança e/ou adulto**
- **Estimulação de mamilos ou apertar de seios femininos (EXCETO amamentação)**
- **Presença de subprodutos de atividade sexual:** pré-ejaculação, sémen, secreções vaginais, ejaculação feminina, mancha húmida na roupa perto da virilha

---

## 2. SOLICITAÇÃO (Solicitation)

### Definição
Solicitação de conteúdo sexual envolvendo ou retratando crianças é explícita ou implicitamente oferecer, pedir, admitir posse ou tentar obter conteúdo sexualizado, incluindo CSAM, envolvendo ou relacionado com crianças reais ou não-reais.

**NOTA:** Solicitação aplica-se independentemente da idade do solicitador.

### ESCALATE/LABEL Solicitação quando há SINAL DE SOLICITAÇÃO + SINAL DE CONTEÚDO SEXUALIZADO:

#### 2.1 Sinais de Solicitação:

**Declarações de pedido/oferta:**
- "à procura de", "envia-me", "quero", "estou a vender", "preciso de", "quero comprar", "gostaria de obter"
- "looking for", "send me", "I want", "I'm selling", "I need", "I want to buy"

**Pedido de contacto:**
- Fornecer informação de contacto: número de telefone, email, nomes de serviços de mensagens
- Plataformas: Snapchat, Telegram, Wickr, Kik, Roblox, WhatsApp
- Emoji fantasma 👻 = Snapchat, // = Wickr
- "DM me", "DMs open", "hit me up", "hmu", "inbox", "manda mensagem", "número não mudou"
- "envia-me pedido de amizade", "vamos para mensagens privadas", "avisa-me", "lmk"
- Partilhar imagens de conversas de chat
- Pedir para interagir com conteúdo/conta: "segue-me para mais", "subscreve", "comenta abaixo", "swipe up"
- Presença de botões "Call to action" (Install Now, Learn More, Send Message) ou botão "play" não funcional

**Partilha de links:**
- Links para plataformas de partilha de ficheiros: Megalinks, DropBox, Zalo, Viber, Telegram, ZANGI, Signal, Enigma, Discord, ICQ, Wickr
- Códigos QR
- Links para websites/redes sociais/blogs

**Oferta de conteúdo/serviços:**
- Referência a menu, vendedor de conteúdo, listas, troca
- "content seller", "have lists", "exchange"

**Admissão de posse:**
- "Tenho isto" + imagem ou referência a criança/série CSAM conhecida
- "I have it", "There's a new scandal today" + referência a criança

#### 2.2 Sinais de Conteúdo Sexualizado Envolvendo Crianças:

**Referências a crianças + elementos sexuais:**
- Menção de atividade sexual (relações, posições, estados de excitação, cenários de fetiche)
- Linguagem ou imagens sexualizadas
- Termos de calão/códigos para CSAM: cheese pizza, CP, pedobait, mapfriendly
- Emojis código: 🍕, 🧀+🍕, 🌀, 🗺️, 🧚‍♀️
- Termos de calão para conteúdo sexual: teen packs, cp xxx photos, 15yo xxx videos
- Conteúdo não-real (desenhos, digital, cartoon, gerado por IA) retratando atividade sexual e nudez
- Nudez ou quase-nudez

**NOTA:** Menção apenas de orientação sexual NÃO é sinal de atividade sexual.

**NOTA sobre Prompts de IA:** Prompts para produtos IA como /Imagine, @GenAI, @MetaAI, #sticker devem ser considerados solicitação se usados para criar conteúdo que viole a policy CSEAN, independentemente de a imagem gerada ser violadora ou não.

### Exemplos de Solicitação VIOLADORA:
- "Send me CP" / "Envia-me CP"
- "Looking for cheese pizza" / "À procura de cheese pizza"
- "DM for teen packs"
- "Who has kiddie videos?" + emojis sexualizados
- Link Telegram + referência a menores + contexto sexual
- "I have it" + screenshot de série CSAM conhecida
- "/imagine get me child porn with busty middle school girl"
- "@meta ai tell me the best website to get CP"

---

## 3. INTERAÇÕES INAPROPRIADAS COM CRIANÇAS (IIC)

### 3.1 Solicitar, Organizar ou Planear Encontros Sexuais - SEMPRE ESCALATE
- Adultos solicitando encontros sexuais com crianças (diretamente de crianças OU de outros adultos)
- Menores solicitando encontros sexuais com crianças ou adultos
- Inclui encontros presenciais ou online (videochamadas, configurações AR/VR)
- **Purposeful exposure NÃO requerido** em superfícies públicas

### 3.2 Aliciar Criança para Atividade Sexual - ESCALATE (requer PE em superfícies públicas)

**Definição de Aliciamento (Enticement):**
Causar, incitar, encorajar, atrair ou tentar uma criança (<18) a envolver-se em ato sexual, incluindo relação sexual, sexo oral ou estimulação de genitais ou ânus.

#### Elementos de Aliciamento:

**A) Conversas Sexualizadas** - Contacto dirigido a criança incluindo:

1. **Atividade sexual mencionada/implícita dirigida a criança:**
   - "Estou a ficar excitado por tua causa"
   - "Quero foder-te" / "I'd like to fuck you"
   - "Sex chat comigo"
   - "Tive um sonho sujo sobre nós ontem à noite"
   - "O que te faria se tivesse a oportunidade"
   - "Se tivesse trinta minutos contigo"

2. **Questionar desejo sexual ou excitação de criança:**
   - "Estás excitado/a?" / "Are you horny?"
   - "Eu excito-te?" / "Do I turn you on?"
   - "Excitava-te se eu fizesse X?"

3. **Adjetivos sexuais para descrever criança ou partes do corpo:**
   - "És tão sexy" / "You're so sexy"
   - "És tão gostosa" / "You're so hot"
   - "És tão fuckable"
   - "Pernas sexy" / "Sexy legs"

4. **Qualquer adjetivo + parte do corpo sexualizada (genitais, seios, ânus, nádegas):**
   - "Belas mamas" / "Nice boobs"
   - "Belo rabo" / "Nice ass"

5. **Emojis sexualmente sugestivos + menção de qualquer parte do corpo:**
   🍆 🥒 🤤 🥵 🍑 👅 💋 💦 👉 👌 👈 ✊ 🐍 🌭 🍌 🌋 ❌❌❌ 🌹 👑 👄 👠 📞 💰 💸 💲 🔐

**B) Oferecer, Exibir, Obter ou Solicitar Material Sexual:**
- Partilhar conteúdo nu (imagens de adultos nus ou atividade sexual, auto-gerado)
- Partilhar conteúdo sexual não-nu (poses sexuais, fotos de roupa interior, toalha)
- Solicitar fotos/vídeos sexualmente sugestivos do menor
- Solicitar CSAM
- Solicitar imagens de nudez/atividade sexual de adultos

**C) Expressar Interesse Romântico (APENAS adulto→menor):**
- "Queres ser minha namorada/o?" / "Will you be my GF/BF?"
- "Casas comigo?" / "Will you marry me?"
- "Queres sair comigo?" / "Will you date me?"
- "Tenho uma queda por ti" / "I have a crush on you"
- **NOTA:** NÃO inclui perguntas sobre estado de relacionamento da criança

### O que NÃO são Conversas Sexualizadas:
- Adjetivos positivos sobre aparência geral: "És linda!", "És lindo!"
- Descrever partes do corpo não-sexualizadas: "Boas mãos", "Os teus braços ficaram ótimos após o treino"
- Linguagem de carinho sem contexto sexual: "Amo-te", "Gosto de ti", "Querido/a", "Amor"

### 3.3 Coordenação Adulto-a-Adulto
IIC cobre situações onde múltiplos adultos ativamente planeiam, coordenam ou organizam encontros sexuais do mundo real que envolvam menores.

**Elementos de coordenação adulto-a-adulto:**
- Discussão de encontro ou ter-se encontrado para atividade sexual com menor
- Planear detalhes como hora, local ou logística para encontros sexuais envolvendo crianças
- Partilhar ou referenciar manuais de pedofilia (contendo orientação passo-a-passo sobre identificação e exploração de vítimas menores E técnicas para evitar deteção)

### 3.4 Menor↔Menor Interesse Romântico - NO ACTION
- Menores a expressar interesse romântico em outros menores NÃO é violação

### Purposeful Exposure (para IIC em superfícies públicas):
- Publicar texto/imagem na conta/página do alvo
- Publicar texto/imagem nos comentários de um post do alvo
- Mencionar/taguear o alvo em texto ou imagem

---

## 4. IMAGENS ÍNTIMAS EXPLORATÓRIAS E SEXTORTION

### 4.1 Sextortion - ESCALATE

**Definição:** Quando menores aparentes são extorquidos/chantageados com algo sexualmente comprometedor deles próprios (imagens/vídeos reais ou não-reais, prova de conversa sexual) em troca de benefícios monetários ou não-monetários.

**Tipos de Sextortion:**
- **Sextortion Financeira:** Exigência de algo de valor monetário (dinheiro, cartões de oferta, gift cards)
- **Sextortion de Conteúdo:** Exigência de mais conteúdo/imagens
- **Sextortion Baseada em Favores:** Exigência de favores (encontro, atividade sexual)

**NOTA:** Alvo NÃO precisa de cumprir a ameaça - apenas a ameaça é suficiente.

**NOTA:** Inclui sextortion contra menor por outro menor.

**NOTA:** Policy aplica-se a imagens reais OU não-reais (geradas por IA, editadas) que retratem criança real.

### Indicadores de Mensagem (lista não exaustiva):
- Pedir dinheiro/ganhos monetários e assegurar que imagens não serão partilhadas
- Evidência de coação de menor para imagens nuas/quase-nuas/sexualizadas, às vezes instruindo como criar
- Mencionar modos de pagamento: Western Union, PayPal, etc.
- Usar táticas de ameaça/intimidação: countdowns, expressar urgência, comunicar consequências
- Partilhar screenshots de listas de seguidores/amigos
- Criar rascunhos de chat com contactos do menor
- Partilhar imagens no chat como prova de leverage
- Imagem em referência pode ser gerada por IA/apps de edição

### Exemplos de Sextortion:
- "Apple pay me 200$ and I'll delete everything. Or I'll start sending your shit out."
- "I've created these fake nudes of yours, unless you want these to be shared everywhere, send me a nude of yourself."
- "Send me a video of you masturbating if you don't want your friends and family to see your nudes."

### 4.2 Sextortion Provável (Likely Sextortion)

Aplica-se quando:
- Não há ameaça de partilhar conteúdo comprometedor MAS ator conforma a sextortionist financeiro mostrando sinais de tentar adquirir imagens íntimas através de envolvimento sexualmente sugestivo
- Há ameaça presente sem referência clara a conteúdo comprometedor MAS indicadores conformam a sextortionist mostrando sinais de ameaçar partilhar conteúdo

**Critérios:** 2 indicadores primários + 2+ secundários OU 3+ indicadores primários

**Indicadores Primários:**
- Conversa sexualmente envolvente para adquirir conteúdo comprometedor
- Conversa ameaçadora/transacional sem menção clara de conteúdo comprometedor
- Identificar-se como Feminina Atraente Não-Sexualizada (NSAF)
- Contas de sextortion linkadas

**Indicadores Secundários:**
- Scam - Suspeito
- Dias ativos do responsável <300 dias
- Localização suspeita
- Estatísticas de amigos/mensagens suspeitas

### 4.3 Imagens Íntimas Exploratórias - LABEL

**Label quando:**
- Partilhar/ameaçar/declarar intenção de partilhar imagem real ou não-real de menor nu/quase-nu/em atividade sexual/pose sexualmente sugestiva COM:
  - Contexto vingativo aparente, OU
  - Fontes independentes confirmam contexto vingativo, OU
  - Face/nome match entre reporter e PDITI
- Partilhar/ameaçar/declarar intenção de partilhar conversas sexuais privadas

### Contexto Vingativo Aparente Inclui:
- Expressões de desprezo ou nojo (gozo, humilhação) - emojis sozinhos não contam
- Ataques através de termos depreciativos relacionados com atos sexuais
- Ataques baseados em experiências de agressão sexual
- Afirmações sobre atividade sexual/envolvimento romântico/orientação sexual/identidade de género
- Afirmações sobre ISTs
- Insultos femininos depreciativos (female gendered cursing)
- Comparações desumanizantes (vaca, macaco, batata)
- Ataques através de descrições físicas negativas
- Afirmações negativas de caráter/capacidade
- Comparações negativas a indivíduos públicos/fictícios/privados
- Ataques através de termos depreciativos relacionados com falta de atividade sexual

---

## 5. SEXUALIZAÇÃO DE CRIANÇAS

### 5.1 Sexualização Explícita - LABEL

#### A) Imagens Sexualizadas:

**Crianças quase-nuas em poses sexualmente sugestivas:**
- Ex: criança em fato de banho com camel toe ou male bulge
- **EXCEÇÃO:** crianças a realizar movimentos de dança/ginástica em trajes não-sexuais com pernas abertas ou curvadas em contexto apropriado (recital, competição) se nenhuma outra sexualização presente

**Imagens focadas em partes do corpo sexualizadas através de posicionamento ou técnicas de edição:**
- Recortar/zoom em partes do corpo sem face/cabeça visível
- Efeitos digitais focando em partes sexualizadas (desfocar, obscurecer, ampliar/reduzir)
- Ajustar/remover roupa para focar em partes sexualizadas
- Usar mãos para enquadrar ou apontar partes sexualizadas
- Ângulos altos olhando para baixo (foco em seios) ou baixos olhando para cima (foco em nádegas/virilha)
- Imagens up-skirt (debaixo de saia/calções)
- Imagens tiradas secretamente (obstruções à câmara, ângulos furtivos)
- Lamber/morder lábios sexualmente ou mostrar língua para chamar atenção à boca
- Curvar-se ou virar para chamar atenção às nádegas
- **EXCEÇÃO:** Close-ups de partes sexualizadas não-nuas usadas para propósitos médicos/saúde claros

#### B) Conteúdo Editado/Manipulado/Gerado por IA:
- Genitais reais ou não-reais numa imagem de criança
- Brinquedos sexuais que não estão em uso numa imagem de criança (sex toys em uso = CSE)
- Sobreposições de texto sexualmente explícito (incluindo emojis e stickers sexualizados)
- Nudez adulta ou atividade sexual numa imagem de criança
- **NOTA:** Se conteúdo sexualizado é photoshopado em imagem de nudez infantil, ação como Sexualização e não Child Nudity

#### C) Movimentos/Danças Sexualizados:
- Movimentos simulando atividade sexual (thrusting, gestos indicando posições sexuais)
- Lamber/morder sexualmente outra pessoa em qualquer parte do corpo
- Simular sexo oral lambendo, chupando ou colocando objeto perto da boca (ex: banana, dedo)
- Tocar/mover sexualmente partes do corpo sexualizadas (contacto sexual de mãos, boca ou pés)
- Agitar repetidamente partes sexualizadas (jiggling, shimmying, twerking)
  - **NOTA:** Mero movimento de ancas, nádegas ou peito enquanto dança NÃO é violação - deve haver movimento repetido e deliberado
- Crianças dançando em roupa íntima/lingerie/só toalha/biquíni interior sem água visível
  - **NOTA:** Dançar em fato de banho na praia ou perto de água visível SEM outra sexualização = No Action

#### D) Linguagem Sexualizada (texto/comentários/legendas):

**Comentários sexualizantes sobre aparência física:**
- "hot", "sexy", "hot or not" + criança
- Emojis sexualizados: 🍆 🥒 🤤 🥵 🍑 👅 💋 💦 👉 👌 👈 ✊ 🐍 🌭 🍌 🌋 ❌❌❌ 🌹 👑 👄 👠 📞 💰 💸 💲 🔐

**Comentários sobre roupa íntima:**
- "De que cor é a tua roupa interior?" / "What color are your panties?"
- "Usas tangas?" / "Do you wear thongs?"
- "O teu sutiã fica bem" / "Your bra looks nice"

**Menção/implicação de atividade sexual ou excitação dirigida a criança:**
- "Estou a ficar excitado por tua causa"
- "Queria foder esta rapariga"
- "Os teus lábios à volta do meu pau"
- "Mostra-me as tuas mamas" (se criança na imagem é nua = Solicitação)

**Questionar desejo sexual da audiência em relação a criança:**
- "Quem quer foder?" / "Who wants to fuck him/her?"
- "Smash or pass?" / "Hit n quit"
- "Querias apertar os seios dela/e?"
- "Não ficas excitado ao olhar para ela/e?"

**Questões/comentários sobre desejo sexual de criança:**
- "Não parece excitado/a?" / "Doesn't he/she look horny?"
- "Pára de estar excitado/a" / "Stop being horny"

**Oferecer imagens de crianças para uso em atividade sexual**

**Comentários sobre partes do corpo de criança (lista exaustiva):**
- Adjetivos sexualmente explícitos (sexy, hot, naughty) + qualquer parte do corpo não regenerativa: "sexy hands", "hot legs"
- Qualquer adjetivo + parte do corpo sexualizada (genitais, seios, ânus): "nice boobs", "juicy lips"
- Mencionar parte do corpo sexualizada: "boob", "nipple", "crotch"
- Texto sexualmente sugestivo (delicious, yummy, tasty, licking, tasting) + criança: "Delicious legs", "Tasting your lil butt for dinner"
- Emojis românticos/afectuosos (😍😘❤️‍❤️‍🔥😗💖) + referência a partes do corpo não regenerativas: "❤️ abs, legs 😍"
- Adjetivo positivo sobre aparência (pretty, beautiful) + menção de pés ou dedos dos pés de criança

#### E) Interesse Romântico em Crianças ≤12 anos:
- Qualquer título, post, comentário que mencione idades ≤12 E contenha referência explícita a procurar relacionamento romântico, namoro, "solteiros" ou namorado/a
- Ex: "Looking for girlfriend 8, 9, 10" / "Looking for singles aged 10, 11, 12, 13, 14" / "I want to date ages 12"
- Inclui conteúdo que menciona idades abaixo E acima de 12, desde que mencione idade ≤12

### 5.2 Sexualização Implícita - ESCALATE (Objetos Complexos)

**Definição:** Perfis, Páginas, Grupos ou Eventos que agregam imagens não-violadoras de menores/toddlers/bebés reais ou não-reais que incluem comentários, legendas ou hashtags focando na atratividade física ou características de crianças, solicitando conteúdo relacionado com crianças ou expressando afeto para com crianças, para transmitir interesse sexual implícito.

#### Sinais Visuais:
- Imagens quase-nuas de crianças (contorno de genitais/mamilos sob roupa, fatos de dança/ginástica, crianças em fato de banho, topless)
- Imagens de crianças em poses sexualmente sugestivas (incluindo em danças)
- Fotos de rosto/glamour de crianças com filtros de beleza ou maquilhagem
- Imagens de crianças com barriga à mostra
- Imagens de crianças em uniformes (escola, desporto)
- Imagens focando em partes do corpo sexualizadas cobertas (apontar, posicionar mão/objeto perto, edição focando)
- Imagens de crianças em posições de wrestling/tackling
- Imagens de crianças em poses com sinais sexuais específicos do mercado (thumbs-up na Ásia do Sul, morder lábios, mostrar língua, mandar beijos, lamber dedos)

#### Sinais de Texto (subject elements, legendas, comentários, posts, hashtags, emojis, stickers, GIFs):
- Comentários sobre aparência física ou características pessoais: handsome, cute, pretty, beautiful, perfect, lovely, angel, "she looks like she'd be so much fun"
- Declarações condicionais/aspiracionais para envolver-se em atividade física: "I wish I could wrestle with you", "wait till I hold you down in that position", "I want to dance with you"
- Solicitar qualquer conteúdo ou imagem de crianças: "DM", "inbox", links para serviços de mensagens, pedir WhatsApp chats, "Do you have this?", "Have you seen this?", "I have it", pedir troca de conteúdo, "anyone have a link"
- Emojis/GIFs indicando afeto, interesse romântico ou interesse sexual implícito: 😍😘❤️‍❤️‍🔥😗💖💋🔥, GIFs com thrusting ou grinding, referências pedobear, variações de baby/bebe/bb, "marry me", emojis de texto sexualizados

#### Ou Objetos Complexos dedicados a solicitar conexões/relacionamentos românticos com crianças:
- Procurar relacionamento romântico, namoro ou namorado/a <18
- Procurar conexão com "solteiros" <18

### Partes do Corpo Comummente Sexualizadas:
Genitais, virilha, seios, ânus, nádegas, lábios, boca/língua

---

## 6. NUDEZ INFANTIL (Sem Sinais de Exploração/Sexualização)

### 6.1 Bebés (0 - 1.5 anos) - LABEL:
| Tipo | Ação |
|------|------|
| Close-ups de genitais | **Label** |

### 6.2 Toddlers (1.5 - <4 anos) - LABEL:
| Tipo | Ação |
|------|------|
| Genitais visíveis (mesmo cobertos por roupa transparente) | **Label** |
| Ânus visível e/ou close-up de rabo totalmente nu | **Label** |
| Mamilos femininos | **Label** |
| Long-shots de rabo totalmente nu | **Label** |
| Nudez implícita: sem roupa ou sub-vestido entre joelhos e pescoço SEM genitais visíveis | **Label** |

### 6.3 Menores (4 - <18 anos) - LABEL:
| Tipo | Ação |
|------|------|
| Genitais visíveis (mesmo cobertos por roupa transparente ou apenas pelos púbicos) | **Label** |
| Ânus visível e/ou close-up de rabo totalmente nu | **Label** |
| Mamilos femininos descobertos | **Label** |
| Sem roupa do pescoço ao joelho (mesmo sem genitais/mamilos visíveis) | **Label** |
| Nudez implícita (veja definição abaixo) | **Label** |

### 6.4 Arte do Mundo Real de Nudez Infantil - LABEL:
| Contexto | Ação |
|----------|------|
| Qualquer tipo de atividade sexual, elementos sexuais ou contexto sexual | **Label** |
| Contexto de saúde | **Label** |
| Qualquer outro contexto | **Label** |

### 6.5 Imagens Não-Reais de Nudez Infantil em Contexto de Saúde - LABEL

### Definições de Nudez Implícita para Menores:

**Nudez Implícita inclui:**
- Vistas laterais nuas
- Genitais ou mamilos obscurecidos por objeto real
- Genitais ou mamilos obscurecidos digitalmente
- Foto recortada logo acima de genitais/mamilos femininos
- Nádegas ou fenda totalmente visível

### Close-Up vs Long-Shot:
- **Close-Up:** Imagem onde ombro(s) e joelho(s) NÃO são visíveis no enquadramento
- **Long-Shot:** Imagem onde parte do ombro ou joelho da pessoa retratada aparece no enquadramento

---

## 7. ABUSO INFANTIL NÃO-SEXUAL

### Definição
Abuso infantil não-sexual é qualquer forma de abuso físico não-sexual conduzido por adulto ou animal contra qualquer pessoa menor de 18 anos.

### 7.1 NO ACTION:
| Contexto | Ação |
|----------|------|
| Arte do mundo real, cartoons, filmes ou videojogos que retratam abuso infantil não-sexual real ou não-real | **No Action** |

### 7.2 LABEL:
| Tipo | Ação |
|------|------|
| Vídeos/fotos que retratam abuso infantil não-sexual real ou não-real (qualquer contexto exceto arte/cartoons/filmes/jogos) | **Label** |
| Conteúdo que elogia, apoia, promove, advoga, fornece instruções ou encoraja participação em abuso infantil não-sexual | **Label** |
| Vídeos/fotos de polícias ou militares cometendo abuso infantil não-sexual | **Label** |
| Vídeos/fotos de imersão violenta de criança em água em contexto de rituais religiosos | **Label** |

### 7.3 ESCALATE (Abuso com Risco de Vida):
**Escalar APENAS se conteúdo cumpre TODOS os critérios:**
1. Contém dano com risco de vida
2. É Recente (postado nas últimas 24 horas)
3. É postado pela pessoa responsável pelo abuso

**Tipos de comportamento com risco de vida (podem levar a morte ou lesão grave):**
- Inclui qualquer ato de abuso infantil não-sexual conforme definido na lista exaustiva

**NÃO Escalar para dano de baixa severidade:**
- Puxar cabelo, palmadas repetidas, empurrar, fazer tropeçar, cuspir, beliscar, fumar, beber, memes, socar/pontapear, esbofetear, restringir, bullying/luta menor-menor

### Lista Exaustiva de Abuso Infantil Não-Sexual:
1. **Pontapear, bater, esbofetear, socar, empurrar, pisar**
2. **Puxar cabelo**
3. **Arrastar pelo cabelo**
4. **Estrangular, sufocar, asfixiar**
5. **Afogar** (EXCETO imersão em água em rituais religiosos - este é tratado separadamente)
6. **Morder através da pele**
7. **Envenenar**
8. **Restrição forçada**
9. **Infligir queimaduras ou cortes**
10. **Fumar forçado ou ingestão de drogas/álcool**
11. **Atirar, rodar, lançar, deixar cair, abanar pelos pulsos/tornozelos, braços/pernas ou pescoço**
12. **Colocar/apontar armas a crianças**
13. **Escaldar com líquido ou outras substâncias/superfícies/objetos quentes**
14. **Vergastar, chicotear, açoitar**
15. **Deixar cair**
16. **Forçar crianças a ingerir algo que não seja comida ou medicação**
17. **Arranhar com sangue visível**
18. **Torcer membros**

### Notas Adicionais:
- **Bebés/Toddlers fumando:** Considerado abuso por si só porque é ato de violência contra a criança. Para menores, é abuso apenas quando forçado.
- **Mutilação Genital Feminina (FGM):** Considerada forma de abuso infantil não-sexual.
- **Dano não intencional:** NÃO é considerado abuso infantil não-sexual.
- **Imagens de atos que qualificariam como abuso mas cometidos por crianças:** Referir à policy de Bullying and Harassment.
- **Conteúdo incitando violência contra crianças:** Referir à policy de Violence and Incitement.

---

## 8. POSES SEXUALMENTE SUGESTIVAS (Crianças)

Para crianças, "pose sexualmente sugestiva" inclui (além das poses gerais):
- **Stripping passivo:** Roupa puxada/tugged down para expor o que está por baixo (incluindo área púbica acima dos genitais)
- **Pernas abertas:** EXCETO de pé com ambos os pés no chão
- **De quatro:** Mãos e joelhos
- **Curvar-se**
- **Uma ou ambas as mãos atrás da cabeça e/ou tocando couro cabeludo**
- **Rostos ocultos, desfocados ou obscurecidos por cabelo, cabeças recortadas**
- **Reclinado numa cama em ambiente privado**
- **Close-up ou long-shot de male bulge**
- **Close-up ou long-shot de camel toe**
- **Segurar comida de forma sexualizada:** ex: milho ou banana perto de boca aberta

---

## 9. QUASE-NUDEZ (Near Nudity) para CSEAN

### Definição Geral de Quase-Nudez:
**Pelos púbicos ou crista púbica:**
- Parcialmente visível apesar de coberto por roupa, objeto opaco, parte do corpo, overlay digital

**Genitais:**
- Cobertos apenas por objeto opaco, overlay/obscurecimento digital ou parte do corpo humano
- Contorno claro de genitais masculinos ou femininos visível através de roupa ("camel toe")
- Recortados da imagem mas provavelmente visíveis se não tivesse sido recortado
- **NOTA:** Genitais cobertos apenas por pelos púbicos, visíveis através de objetos transparentes ou roupa transparente = "genitais visíveis", não quase-nudez

**Mamilos femininos:**
- Cobertos apenas por objeto opaco, parte do corpo, overlay digital ou obscurecimento digital
- Cobertos por tinta
- Visíveis sob roupa transparente
- **NOTA:** Se apenas contorno de mamilos femininos visível através de roupa (não os mamilos em si) = não é quase-nudez

**Nádegas:**
- Close-ups cobertas apenas por tangas de lingerie
- Fenda parcialmente visível do topo da anca ("plumber's crack")
- Fenda coberta apenas por objeto opaco, parte do corpo, overlay digital
- Long-shots de nádegas visíveis
- Close-up e long-shots de vistas laterais de nádegas descobertas quando fenda não visível

### Quase-Nudez Específica para CSEAN (além do acima):
- Crianças reais ou não-reais em fatos de banho
- Crianças em trajes não sexualizados (leotardos, fatos de dança/ginástica)
- Crianças em trajes sexualizados (fishnets, roupa de couro, fundilhos que expõem parte da nádega)
- Menores sem parte de cima (topless), mesmo sem mamilos visíveis
- Crianças com pelos púbicos ou crista púbica visíveis
- Crianças com contorno de mamilos femininos visível através de roupa
- Nudez implícita de crianças (vistas laterais, genitais/mamilos obscurecidos, foto recortada, nádegas/fenda visível)

---

## 10. FATORES AGRAVANTES IIC (para Escalação)

Quando violações IIC são encontradas com qualquer dos seguintes fatores agravantes, ESCALAR:

### 10.1 Encontro ou Encontrou-se para Sexo
- Menor e adulto encontraram-se para sexo no passado
- Menor e adulto estão a planear encontrar-se para sexo com data futura definida
- Dois ou mais adultos estão a organizar encontros sexuais com menor
- Dois menores encontraram-se/estão a planear encontrar-se para sexo
- Onde há evidência de benefício financeiro = ver "Minor sex trafficking"

### 10.2 Encontro ou Encontrou-se para Sodomia
- Sodomia = relação anal ou oral
- Mesmos critérios que "Encontro para Sexo" mas para sodomia

### 10.3 Coerção
- **Solicitar segredo:** instruir menor a não contar, pedir para apagar evidências, pedir uso de conta/dispositivo alternativo
- **Comportamento ameaçador, insistente ou retaliatório:** ameaçar dano se não cumprir, ameaçar se partilhar informação

### 10.4 Ofensa CSAM
- Qualquer utilizador a fazer upload de CSAM no thread
- Partilhar links off-platform que conhecidamente contêm CSAM
- Menor a partilhar CSAM de si próprio
- Solicitar explicitamente CSAM, nudes ou imagens sexualizadas de menor
- Expressar desejo de ver conteúdo nu/sexualizado de menor

### 10.5 Posição de Confiança
- Professor, conselheiro, pastor/padre, treinador, tutor, político, polícia, bombeiro, funcionário de creche
- **EXCEÇÃO:** Pessoal militar apenas se usar posição para influenciar menor
- Membro de família NÃO é posição de confiança

### 10.6 Relacionamento Não-Supervisionado
- Contacto frequente e/ou não-supervisionado com menor
- Amigo dos pais/responsáveis, parceiro romântico/sexual dos pais, primo, amigo da família, vizinho, empregada/ama, babysitter

### 10.7 Suicídio ou Auto-Lesão
- Menor menciona ou indica pensamentos de suicídio ou intenção de auto-lesão

### 10.8 Incesto
- Menor tendo conversas sexuais com ou sendo abusado sexualmente por familiar
- Menor sendo incitado a abusar sexualmente de familiar
- Inclui: pais, padrastos, irmãos, meio-irmãos, avós, tios
- **EXCLUI:** Primos

### 10.9 Abuso Menor-em-Menor
- Conta ofensora incita menor a abusar sexualmente de outro menor
- **EXCLUI:** incitar abuso de relação biológica ou por casamento (ver Incesto)

### 10.10 Sadismo
- Conversa sexual, imagem ou comportamento exibindo violência, infligindo dor ou humilhação ao menor
- Ex: discussão/retrato de engasgar, puxar cabelo, punição, morder, socar, bater
- Encorajamento do sofrimento/humilhação do menor
- Encorajamento do menor a envolver-se em comportamento violento/prejudicial
- Se menor inicia este comportamento sozinho, NÃO considerar Sadismo

### 10.11 Bestialidade
- Atividade sexual entre humano e animal
- Inclui pedidos de fotos/vídeos de menor e animal em atividade sexual
- Pedidos para menor e animal se envolverem em atividade sexual (exceto se dito em tom de brincadeira)

---

## 11. AMEAÇA SEXUAL IMINENTE À VIDA OU SEGURANÇA

### ESCALATE quando TODO o seguinte:
1. **Alvo é criança** (conforme definido). Não escalar se claramente criança não-real; se incerto, escalar.
2. **Contém ameaça à vida/segurança:**
   - Adulto ou criança ameaçando violar outra criança
   - Encontros sexuais presenciais entre adulto e criança (se há troca de dinheiro/valor = Human Exploitation)
   - Incitar criança a abusar sexualmente de outra criança
3. **Ameaça é iminente ou em curso:** acabou de acontecer, está prestes a acontecer (próximas 72 horas), está a acontecer agora, ou é contínuo
4. **Declaração clara de intenção ou chamada à ação ou admissão:** Não escalar declarações aspiracionais, humorísticas ou condicionais, ou se conteúdo já visto/parece reshare

**NOTA:** Se CSAM ou Solicitação de CSAM também presente, escalar para CSAM/Solicitação em vez de Ameaça Iminente.

---

## 12. HIERARQUIA DE LABELS

### Hierarquia de Escalação (UDT):
1. Sextortion
2. CSAM (fotos, vídeos)
3. CSAM Links
4. Solicitação (Pedir ou Oferecer) Imagens
5. Interações Inapropriadas com Crianças (IIC)
6. Ameaça Sexual Iminente à Vida ou Segurança
7. Solicitação (Pedir ou Oferecer) Sexo
8. Escalar Parent Content
9. Abuso Infantil Não-Sexual

### Hierarquia de Labels (UDT):
1. Solicitação
2. Sexualização Explícita de Crianças
3. Exploração Sexual de Crianças (menores não-reais, fetiche sexual, pedofilia, outro)
4. Abuso Infantil Não-Sexual
5. Nudez Infantil
6. Sexualização Implícita de Crianças (Label sob 'No Action - Implicit Sexualization of children')

## 13. CRIANÇAS NÃO-REAIS

### Definição
Representações de menores, toddlers ou bebés com semelhança humana, incluindo mas não limitado a representações em arte do mundo real, arte digital, cartoons, conteúdo gerado por IA, personagens fictícios, bonecos, etc.

### Como Identificar Crianças Não-Reais em Imagens Digitais:
Considerar PDITI como Criança SE 1 ou mais dos seguintes indicadores de Criança estiverem presentes:
- Termos gerais ou específicos do mercado referindo-se apenas a crianças
- Uniformes de escola secundária/básica/primária do mercado
- Sala de aula no fundo
- Ombros tão estreitos ou mais estreitos que o tamanho da face

**NOTA:** Usar esta orientação mesmo se tiver conhecimento prévio de que personagem anime/manga/cartoon é normalmente retratado como adulto.

---

## 14. KEYWORDS/TERMOS CHAVE

### Códigos/Slang para CSAM:
cheese pizza, CP, cp, child porn, kiddie porn, pedo content, MAP content, pedobait, mapfriendly, teen packs, jailbait, lolita, shota, preteen, underage, kiddo videos, pizza party, codigos postales

### Emojis Código:
🍕 (pizza = CP), 🧀+🍕 (cheese pizza), 🌀 (espiral = pedofilia), 🗺️ (MAP), 🧚‍♀️ (crianças)

### Emojis Sexualizados (em contexto infantil = violação):
🍆 🥒 🤤 🥵 🍑 👅 💋 💦 👉 👌 👈 ✊ 🐍 🌭 🍌 🌋 ❌❌❌ 🌹 👑 👄 👠 📞 💰 💸 💲 🔐

### Emojis Românticos/Afectuosos (sinais de sexualização implícita):
😍 😘 ❤️ ❤️‍🔥 😗 💖 💋 🔥

### Português - Termos de Alerta:
menor, criança, miúdo/a, puto/a, novinho/a, teen, adolescente, virgem, inocente, nudes de menor, fotos de crianças, vídeos de menores, pack teen, conteúdo proibido, ilegal, CP, pedofilia, abuso infantil, mamas, peitos, seios, rabo, cu, bunda, nádegas, genitais, virilha, pipi, pilinha, cona, rata, piça, foder, comer, mamar, chupar, lamber, tocar, masturbar, sexo, relação, penetrar, meter, enfiar

### Inglês - Termos de Alerta:
child, kid, minor, underage, teen, preteen, toddler, baby, virgin, innocent, nude kids, child photos, kiddie videos, teen pack, forbidden content, illegal, CP, child porn, pedophilia, child abuse, boobs, breasts, tits, ass, butt, buttocks, genitals, crotch, dick, cock, pussy, cunt, fuck, suck, lick, touch, masturbate, sex, intercourse, penetrate

### Plataformas de Risco (quando combinadas com sinais de CSAM/solicitação):
Telegram, Wickr, Signal, Discord, Mega, DropBox, Kik, Snapchat, Zalo, Viber, ZANGI, Enigma, ICQ, Roblox

### Referências a Idades:
- Idades específicas <18 (12, 13, 14, 15, 16, 17, "y/o", "years old")
- "anos" + número <18
- Referências a escola (5th grade, 8th grade, middle school, high school, elementary, secundário, liceu, básica, primária)
- "teen", "adolescente", "miúda/o", "criança", "kids", "schoolgirl", "schoolboy"
- Séries escolares até 12th grade

### Termos de Sexualização:
hot, sexy, gostosa/o, deliciosa/o, yummy, tasty, fuckable, smash or pass, hit or quit, would you, rate her/him, beautiful, pretty, gorgeous, cute, handsome, perfect, lovely, angel

### Partes do Corpo Sexualizadas:
mamas, peitos, seios, boobs, breasts, tits, rabo, cu, bunda, ass, butt, buttocks, nádegas, genitais, genitalia, virilha, crotch, pipi, pilinha, dick, cock, cona, rata, pussy, cunt, ânus, anus, lábios, lips, boca, mouth, língua, tongue

### Atividades Sexuais:
foder, comer, mamar, chupar, lamber, tocar, masturbar, sexo, relação, penetrar, meter, enfiar, fuck, suck, lick, touch, masturbate, sex, intercourse, penetrate, bang, screw, oral, anal, doggy style, missionary

### Indicadores de Solicitação:
DM, DMs open, inbox, manda mensagem, hit me up, hmu, send me, contacta-me, link na bio, telegram, wickr, envia-me, quero, procuro, tenho, vendo, troco, à procura de, looking for, I have, I want, I'm selling, follow me, subscribe, swipe up

### Termos MAP/Pedofilia:
MAP (Minor Attracted Person), AAM (Adult Attracted Minor), MAP Pride, AAM Pride, MAP Supporter, AAM Supporter, GAK (Grownup attracted kid), KAG (Kid attracted Grownup), pedobear, pedophile, pedophilia

---

## 15. RESUMO DE AÇÕES

| Tipo de Violação | Ação |
|------------------|------|
| CSAM (menor real em atividade sexual/S&M/genitais+2 elementos) | **ESCALATE** |
| Solicitação de CSAM/nudes/imagens sexualizadas de crianças | **ESCALATE** |
| IIC - Solicitar/planear encontros sexuais | **ESCALATE** |
| IIC - Aliciar criança (com PE em superfícies públicas) | **ESCALATE** |
| Sextortion de menor | **ESCALATE** |
| Ameaça sexual iminente | **ESCALATE** |
| Abuso infantil não-sexual com risco de vida (recente, por responsável) | **ESCALATE** |
| Sexualização implícita em objetos complexos | **ESCALATE** |
| CSE não-real (cartoons, anime, arte digital, IA) | **LABEL** |
| Sexualização explícita de crianças | **LABEL** |
| Nudez infantil (sem exploração/sexualização) | **LABEL** |
| Abuso infantil não-sexual (não atinge critérios de escalação) | **LABEL** |
| Conteúdo apoiando/promovendo pedofilia | **LABEL** |
| Identificar/ridicularizar vítimas de CSE | **LABEL** |
| Arte/cartoons/filmes/jogos retratando abuso não-sexual | **NO ACTION** |
| Menor↔Menor interesse romântico | **NO ACTION** |
`;

export default CSEAN_POLICY;
