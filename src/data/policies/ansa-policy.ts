export const ANSA_POLICY = `
# Adult Nudity and Sexual Activity (ANSA)

## Definição
Restringimos a exibição de nudez e atividade sexual porque algumas pessoas na comunidade podem ser sensíveis a este tipo de conteúdo, particularmente devido ao contexto cultural ou idade.

A nudez pode ser partilhada por várias razões legítimas: protesto, sensibilização, fins educacionais ou médicos. Quando apropriado e a intenção é clara, fazemos exceções (ex: amamentação, cicatrizes pós-mastectomia, arte).

Em anúncios e superfícies de comércio, conteúdo adulto é PROIBIDO.

---

## Tipos de Imagem
A policy distingue 3 tipos de imagem (verificar nesta ordem):

1. **Imagem Fotorrealista** - Parece fotografia/vídeo de pessoa real. Na dúvida, assumir fotorrealista.
2. **Arte do Mundo Real** - Objetos físicos (estátuas, pinturas, esculturas). Indicadores: meio tradicional (tinta, lápis), meio físico presente.
3. **Imagem Digital** - Gerada por AI/computador, não fotorrealista. Inclui: Photoshop, programas de pintura, ASCII art.

---

## Subcategorias e Labels

### 1. Atividade Sexual Adulta (Fotorrealista/Digital)

| Subcategoria | Contexto | Ação |
|--------------|----------|------|
| Atividade sexual explícita | Contexto médico/saúde | **Label** |
| Atividade sexual explícita | Formas corporais visíveis | **Label** |
| Atividade sexual explícita | Qualquer outro contexto | **Label** |
| Atividade sexual implícita | Formas corporais visíveis | **Label** |
| Atividade sexual implícita | Ficção reconhecida | **Label** |
| Atividade sexual implícita | Contexto médico/saúde | **Label** |
| Atividade sexual implícita | Educação sexual | **Info** |
| Atividade sexual implícita | Qualquer outro contexto | **Label** |
| Fetiche | Qualquer contexto | **Label** |
| Atividade relacionada a sexo | - | **Label** |
| Simulação de atividade sexual | - | **Label** |
| Gestos que simbolizam genitais/masturbação/sexo oral/intercurso | - | **Label** |
| Logos/screenshots de sites pornográficos | - | **Label** |

### 2. Nudez Adulta (Fotorrealista/Digital)

| Subcategoria | Contexto | Ação |
|--------------|----------|------|
| Genitais visíveis / ânus / close-up de nádegas | Fome/genocídio/crimes de guerra | **Label** |
| Genitais visíveis / ânus / close-up de nádegas | Contexto médico/saúde | **Label** |
| Genitais visíveis / ânus / close-up de nádegas | Cirurgia de confirmação de género | **Label** |
| Genitais visíveis / ânus / close-up de nádegas | Qualquer outro contexto | **Label** |
| Mamilos femininos visíveis | Fome/genocídio/crimes de guerra | **Label** |
| Mamilos femininos visíveis | Contexto médico/saúde | **Label** |
| Mamilos femininos visíveis | Cirurgia de confirmação de género | **Label** |
| Mamilos femininos visíveis | Ato de protesto | **Label** |
| Mamilos femininos visíveis | Amamentação (não sexualizada) | **Label** |
| Mamilos femininos visíveis | Qualquer outro contexto | **Label** |
| Vídeos focados em virilha/nádegas/seios sem consciência da pessoa | - | **Label** |
| Pose sexualmente sugestiva + quase nudez | - | **Label** |
| Pose sexualmente sugestiva + foco na virilha/nádegas | - | **Label** |
| Quase nudez | - | **Label** |
| Virilha/nádegas/seios são o foco da imagem | - | **Label** |
| Pose sexualmente sugestiva (fora contexto médico/científico) | - | **Label** |

### 3. Arte do Mundo Real - Atividade Sexual

| Subcategoria | Contexto | Ação |
|--------------|----------|------|
| Atividade sexual explícita/implícita | Contexto médico/saúde | **Label** |
| Atividade sexual implícita | Educação sexual | **Info** |
| Atividade sexual explícita/implícita | Formas corporais visíveis | **Label** |
| Atividade sexual explícita/implícita | Qualquer outro contexto | **Label** |
| Fetiche (bestialidade neutral/condenação, não real) | - | **Label** |
| Fetiche (qualquer outro) | - | **Label** |
| Atividade relacionada a sexo | - | **Label** |
| Simulação de atividade sexual | - | **Label** |
| Gestos sexuais | - | **Label** |
| Logos de sites pornográficos | - | **Label** |

### 4. Arte do Mundo Real - Nudez

| Subcategoria | Contexto | Ação |
|--------------|----------|------|
| Genitais/ânus/close-up nádegas | Nudez NÃO é o foco | **No Action** |
| Genitais/ânus/close-up nádegas | Nudez É o foco | **Label** |
| Genitais/ânus/close-up nádegas | Contexto médico/saúde | **Label** |
| Genitais/ânus/close-up nádegas | Cirurgia confirmação género | **Label** |
| Mamilos femininos visíveis | Nudez NÃO é o foco | **No Action** |
| Mamilos femininos visíveis | Nudez É o foco | **Label** |
| Mamilos femininos visíveis | Contexto médico/saúde | **Label** |
| Mamilos femininos visíveis | Cirurgia confirmação género | **Label** |
| Mamilos femininos visíveis | Amamentação (não sexualizada) | **Label** |
| Pose sexualmente sugestiva + quase nudez | Arte | **No Action** |
| Pose sexualmente sugestiva + foco virilha/nádegas | Arte | **No Action** |
| Quase nudez em arte | - | **No Action** |
| Virilha/nádegas/seios são foco em arte | - | **No Action** |
| Pose sexualmente sugestiva em arte | - | **No Action** |

### 5. Outro Conteúdo Sexual

| Subcategoria | Ação |
|--------------|------|
| Áudio sexual < 10 segundos | **Label** |
| Áudio sexual ≥ 10 segundos | **Label** |

### 6. Animais

| Subcategoria | Ação |
|--------------|------|
| Animais em atividade sexual ou genitais visíveis | **Label** |

### 7. Conteúdo Sexualmente Sugestivo (Fotorrealista/Digital)

| Subcategoria | Ação |
|--------------|------|
| Stripping / passive stripping | **Label** |
| Roupa reveladora (equivalente a roupa interior) | **Label** |
| Tocar/mover partes do corpo sexualizadas | **Label** |
| Mulher de topless vista de costas | **Label** |

---

## Glossário de Termos Críticos

### Atividade Sexual Explícita
- Intercurso/sexo oral com genitais/ânus visíveis
- Estimulação de genitais/ânus com contacto diretamente visível
- Inserção de brinquedos sexuais com genitais/ânus visíveis

### Atividade Sexual Implícita
- Intercurso/sexo oral onde genitais/ânus/contacto NÃO é diretamente visível
- Estimulação onde genitais/ânus/estimulação NÃO é diretamente visível
- Atividade sexual iminente (posições que sugerem contacto prestes a iniciar)

### Outra Atividade Sexual
- Ereção (com indicadores de contexto + forma)
- Subprodutos de atividade sexual (pré-ejaculação, sémen, secreções vaginais)
- Brinquedo sexual na boca
- Estimulação de mamilo visível
- Apertar seio feminino

### Fetiche (Lista Exaustiva para ANSA)
- Atos que podem levar à morte (crushing, asfixia erótica)
- Desmembramento
- Canibalismo
- Fezes, urina, cuspo, muco, menstruação, vómito
- Bestialidade
- Incesto

### Quase Nudez
- Pelos púbicos ou crista púbica parcialmente visíveis
- Genitais cobertos apenas por objeto opaco/sobreposição digital/parte do corpo
- Contorno claro de genitais através da roupa ("camel toe")
- Mamilos femininos cobertos apenas por objeto opaco/tinta/roupa transparente
- Nádegas: tangas de lingerie (close-up), roupa transparente, "butt crack" visível/coberto

### Pose Sexualmente Sugestiva
**Pernas abertas** (sentado/ajoelhado/deitado) + NÃO em contexto fitness/dança + um dos seguintes:
- Roupa interior ou equivalente na virilha
- Meias/collants sobre roupa interior
- Genitais cortados mas provavelmente visíveis se não cortados
- Pelos púbicos visíveis

**Inclinado** (em pé/ajoelhado/de quatro) + NÃO em contexto fitness/dança + um dos seguintes:
- Roupa interior ou equivalente na virilha
- Meias/collants sobre roupa interior
- Roupa interior visível por baixo de outra roupa

### Roupa Reveladora
**Mulheres:** Cobertura equivalente a roupa interior na virilha/seios, ou roupa que mostra maioria/parte inferior do seio
**Homens:** Cuecas, trunks, boxers curtos (não calções), ou roupa transparente

### Contextos Especiais
- **Contexto Médico/Saúde:** Informar sobre questões de saúde, anatomia, doenças. Inclui parto, mastectomia, exames médicos.
- **Contexto de Amamentação:** Seio ligado a bomba ou com bebé/criança/animal a mamar ou em posição razoável para começar.
- **Ato de Protesto:** Edifício governamental, palavras pintadas no corpo, cartazes com mensagem política, evacuação forçada, militares/polícia presentes.
- **Cenário Privado:** Locais sem expectativa de público (residência, carro, quarto de hotel, casa de banho).

---

## Quando É Violação

### Sempre Label:
- Atividade sexual explícita ou implícita (fotorrealista/digital)
- Genitais, ânus ou close-up de nádegas visíveis
- Mamilos femininos visíveis
- Fetiche (lista específica)
- Quase nudez
- Pose sexualmente sugestiva
- Roupa reveladora em contexto sexualizado
- Áudio sexual
- Animais em atividade sexual ou com genitais visíveis
- Stripping ou passive stripping
- Logos/screenshots de sites pornográficos conhecidos

### Indicadores de Amamentação Sexualizada (LABEL):
- Links para sites adultos/pornográficos/OnlyFans no perfil
- Nome do perfil com referências a genitais ou atividade sexual
- Foco no seio não ocupado enquanto bebé é digitalmente obscurecido
- Figura masculina a ver conteúdo de amamentação sem contexto educacional
- Áudio sexual presente
- #viral na legenda
- Declarações a redirecionar para conteúdo privado/restrito
- Mais de 5 hashtags não relacionadas com amamentação
- Colagens de múltiplas mães a amamentar
- Sem correspondência facial com quem publicou (exceto com permissão declarada)
- Botão de play falso
- Mamilos cobertos com roupa transparente

---

## Quando NÃO É Violação (Exceções)

### No Action para Arte do Mundo Real:
- Nudez (genitais/mamilos) quando NÃO é o foco da imagem
- Pose sexualmente sugestiva + quase nudez
- Pose sexualmente sugestiva + foco na virilha/nádegas
- Quase nudez
- Virilha/nádegas/seios como foco
- Pose sexualmente sugestiva

### Contextos que NÃO são pose sexualmente sugestiva:
- Contexto de fitness, desporto ou dança
- Roupa de banho (excluída da definição de roupa interior)

### Contextos que NÃO são roupa reveladora:
- Contexto atlético/desportivo apropriado
- Contexto de evento formal (tapete vermelho, casamento, baile)
- Depições incidentais/de fundo

### NÃO é violação:
- Apertar/cobrir seio com palmas ou dedos retos (sem movimento de agarrar)
- Abraçar peito/seios com roupa
- Contorno de mamilos femininos através da roupa (apenas contorno, não mamilos visíveis)
- Ajustar roupa perto de partes sexualizadas
- Movimento incidental de ancas/nádegas/peito ao dançar (sem agitação deliberada)

---

## Exemplos de Violação (Descrições para Análise de Texto)

### Atividade Sexual Explícita:
- "Imagem mostra duas pessoas nuas com genitais visíveis durante intercurso"
- "Vídeo de pessoa a masturbar-se com genitais expostos"
- "Imagem de sexo oral com contacto boca-genitais visível"

### Atividade Sexual Implícita:
- "Duas pessoas nuas em posição sexual, genitais cobertos por lençol"
- "Pessoa em movimento de vai-e-vem com expressão de prazer, parceiro cortado da imagem"
- "Casal a beijar-se intensamente enquanto remove roupa, mãos a aproximar-se da zona genital"

### Nudez Adulta:
- "Mulher nua com mamilos visíveis numa selfie de quarto"
- "Homem nu com pénis exposto em foto de perfil"
- "Close-up de nádegas nuas sem contexto artístico"
- "Foto de virilha com pelos púbicos visíveis"

### Quase Nudez:
- "Mulher com mamilos cobertos apenas pelas mãos"
- "Homem com genitais cobertos apenas por emoji"
- "Imagem com 'camel toe' claramente visível através de leggings"
- "Nádegas visíveis através de roupa transparente"

### Pose Sexualmente Sugestiva:
- "Mulher de pernas abertas sentada, usando apenas cuecas"
- "Pessoa inclinada de quatro, roupa interior visível por baixo da saia"
- "Homem deitado com pernas abertas em cuecas, virilha é o foco"

### Fetiche:
- "Conteúdo mostrando pessoa a ser asfixiada durante ato sexual"
- "Imagem de atividade sexual envolvendo humano e animal"
- "Conteúdo sexual envolvendo fezes ou urina"

### Conteúdo Sexualmente Sugestivo:
- "Vídeo de pessoa a despir-se lentamente, expondo roupa interior"
- "Mulher a abanar os seios de forma repetida e deliberada"
- "Pessoa a esfregar a virilha repetidamente com a mão"

---

## Exemplos de NÃO Violação (Descrições para Análise de Texto)

### Arte do Mundo Real (nudez não é foco):
- "Fotografia de quadro renascentista com várias figuras, uma delas nua ao fundo"
- "Imagem de estátua clássica num museu, nudez presente mas não destacada"
- "Pintura de cena mitológica onde nudez é elemento secundário"

### Contextos Médicos/Educacionais:
- "Diagrama anatómico mostrando órgãos reprodutores"
- "Imagem de exame de mamografia para sensibilização do cancro da mama"
- "Fotografia de parto para fins educacionais"

### Amamentação Legítima:
- "Mãe a amamentar bebé, mamilo parcialmente visível, contexto familiar"
- "Vídeo educacional sobre técnicas de amamentação"

### Contexto de Protesto:
- "Ativistas de topless em manifestação com mensagens pintadas no corpo"
- "Protesto nu frente a edifício governamental"

### Contexto Desportivo/Atlético:
- "Atleta de voleibol de praia em biquíni durante jogo"
- "Ginasta em collant durante competição"
- "Nadador em speedo no pódio olímpico"

### Contexto Formal:
- "Celebridade em vestido revelador no tapete vermelho dos Óscares"
- "Noiva em vestido decotado no casamento"

### Não Sexual:
- "Pessoa a ajustar a alça do sutiã"
- "Dançarina com movimento natural das ancas durante coreografia"
- "Mulher de costas de topless numa praia"

---

## Keywords/Termos Chave

### Português:
nudez, nu, nua, pelado, pelada, despido, despida, seios, mamas, peitos, mamilo, mamilos, nádegas, rabo, cu, traseiro, bunda, genitais, pénis, pila, piça, vagina, cona, rata, buceta, sexo, foder, trepar, coito, intercurso, masturbação, punheta, broche, sexo oral, felação, cunnilingus, orgasmo, ejaculação, esperma, sémen, excitação sexual, pose sexy, pose provocante, roupa interior, cuecas, tanga, sutiã, lingerie, transparente, revelador, decotado, strip, stripper, despir, tirar roupa, pornografia, porno, xxx, onlyfans, fetiche, bdsm, bondage, asfixia erótica, bestialidade, incesto, voyeur, upskirt, creepshot, amamentação sexualizada

### Inglês:
nudity, naked, nude, topless, bottomless, breasts, boobs, tits, nipple, nipples, buttocks, ass, butt, booty, genitals, penis, dick, cock, vagina, pussy, cunt, sex, fuck, intercourse, coitus, masturbation, handjob, blowjob, oral sex, fellatio, cunnilingus, orgasm, ejaculation, cum, semen, sexual arousal, sexy pose, provocative pose, underwear, panties, thong, bra, lingerie, see-through, revealing, cleavage, strip, stripper, undress, stripping, porn, pornography, xxx, onlyfans, fetish, bdsm, bondage, erotic asphyxiation, bestiality, incest, voyeur, upskirt, creepshot, sexualized breastfeeding, camel toe, bulge, erection, spread legs, bent over

### Termos de Sites Pornográficos Conhecidos:
pornhub, xvideos, xnxx, redtube, youporn, xhamster, spankbang, brazzers, bangbros, realitykings, spicy.porn

### Indicadores de Contexto (podem modificar decisão):
contexto médico, contexto de saúde, amamentação, mastectomia, parto, educação sexual, arte, museu, galeria, estátua, pintura, escultura, protesto, manifestação, ativismo, desporto, atleta, competição, ginástica, natação, fitness, dança, evento formal, tapete vermelho, casamento, gala
`;

export default ANSA_POLICY;
