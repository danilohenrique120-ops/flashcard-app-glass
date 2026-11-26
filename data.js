// Curadoria baseada nos pioneiros históricos da Aquisição de Segunda Língua (SLA):
// 1. Paul Nation & Michael West (General Service List - Alta Frequência & Sobrevivência)
// 2. Michel Thomas & Paul Pimsleur (Estruturas Modais e Verbos de Intenção: querer, poder, precisar + infinitivo)
// 3. Michael Lewis (Lexical Approach - Chunks comunicativos prontos e conectores conversacionais)
// 4. Stephen Krashen & Alexander Arguelles (Input Compreensível e Frases de Negociação de Significado)

const INITIAL_DECKS = {
  en: {
    id: 'en',
    name: 'Inglês',
    nativeName: 'English',
    flag: '🇺🇸',
    speechLang: 'en-US',
    accentColor: '#38bdf8',
    cards: [
      // MÓDULO 1: Michel Thomas & Pimsleur — Núcleo Modal de Intenção (Destrava centenas de frases)
      {
        id: 'en-1',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'I want to go / I want to eat',
        phonetic: '/aɪ wɑnt tu ɡoʊ/ • /aɪ wɑnt tu it/',
        back: 'Eu quero ir / Eu quero comer',
        example: 'I want to eat something now, please.',
        exampleTranslation: 'Eu quero comer algo agora, por favor.',
        tip: 'Michel Thomas ensina que "I want to + verbo" permite expressar qualquer desejo imediatamente sem conjugar.'
      },
      {
        id: 'en-2',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'I need to know / I need to find',
        phonetic: '/aɪ nid tu noʊ/ • /aɪ nid tu faɪnd/',
        back: 'Eu preciso saber / Eu preciso encontrar',
        example: 'I need to find the train station.',
        exampleTranslation: 'Eu preciso encontrar a estação de trem.',
        tip: 'Combine "I need to..." com qualquer ação básica para resolver urgências.'
      },
      {
        id: 'en-3',
        category: 'Núcleo de Intenção',
        theorist: 'Método Pimsleur',
        front: 'Can you help me?',
        phonetic: '/kæn ju hɛlp mi/',
        back: 'Você pode me ajudar?',
        example: 'Excuse me, can you help me with this?',
        exampleTranslation: 'Com licença, você pode me ajudar com isto?',
        tip: '"Can you..." e "Can I..." cobrem 80% dos pedidos educados na vida real.'
      },
      {
        id: 'en-4',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'I have to leave now',
        phonetic: '/aɪ hæv tu liv naʊ/',
        back: 'Eu tenho que sair agora',
        example: 'Sorry, I have to leave now because it is late.',
        exampleTranslation: 'Desculpe, tenho que sair agora porque está tarde.',
        tip: '"I have to" expressa obrigação de forma muito mais natural na fala que "I must".'
      },
      {
        id: 'en-5',
        category: 'Núcleo de Intenção',
        theorist: 'Método Pimsleur',
        front: 'I would like to order / I would like this',
        phonetic: '/aɪ wʊd laɪk tu ˈɔrdər/',
        back: 'Eu gostaria de pedir / Eu gostaria disto',
        example: 'I would like a coffee and water, please.',
        exampleTranslation: 'Eu gostaria de um café e água, por favor.',
        tip: 'Chunk essencial de polidez universal para restaurantes, lojas e hotéis.'
      },

      // MÓDULO 2: Krashen & Negociação de Significado (Manter a conversa fluindo enquanto aprende)
      {
        id: 'en-6',
        category: 'Negociação de Sentido',
        theorist: 'Stephen Krashen (i+1)',
        front: 'Could you speak more slowly, please?',
        phonetic: '/kʊd ju spik mɔr ˈsloʊli pliz/',
        back: 'Você poderia falar mais devagar, por favor?',
        example: 'I am learning English. Could you speak more slowly?',
        exampleTranslation: 'Estou aprendendo inglês. Poderia falar mais devagar?',
        tip: 'Segundo Krashen, ajustar a velocidade do interlocutor transforma ruído em Input Compreensível.'
      },
      {
        id: 'en-7',
        category: 'Negociação de Sentido',
        theorist: 'Stephen Krashen (i+1)',
        front: 'What does that mean?',
        phonetic: '/wʌt dʌz ðæt min/',
        back: 'O que significa isso?',
        example: 'Wait, what does that word mean?',
        exampleTranslation: 'Espere, o que significa essa palavra?',
        tip: 'A pergunta mais poderosa para aprender vocabulário novo durante uma conversa real.'
      },
      {
        id: 'en-8',
        category: 'Negociação de Sentido',
        theorist: 'Charles Berlitz (Método Direto)',
        front: 'How do you say this in English?',
        phonetic: '/haʊ du ju seɪ ðɪs ɪn ˈɪŋɡlɪʃ/',
        back: 'Como se diz isto em inglês?',
        example: 'How do you say "saudade" in English?',
        exampleTranslation: 'Como se diz "saudade" em inglês?',
        tip: 'Aponte para qualquer objeto e use esta frase para adquirir substantivos sem dicionário.'
      },
      {
        id: 'en-9',
        category: 'Negociação de Sentido',
        theorist: 'Paul Pimsleur',
        front: 'I understand a little, but not everything',
        phonetic: '/aɪ ˌʌndərˈstænd ə ˈlɪtəl bʌt nɑt ˈɛvriˌθɪŋ/',
        back: 'Eu entendo um pouco, mas não tudo',
        example: 'I understand a little English, can you repeat?',
        exampleTranslation: 'Eu entendo um pouco de inglês, pode repetir?',
        tip: 'Mantém a empatia do nativo e evita que ele mude de idioma ou fale rápido demais.'
      },

      // MÓDULO 3: Michael Lewis — Lexical Chunks & Conectores de Fluência
      {
        id: 'en-10',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: 'What do you think about...?',
        phonetic: '/wʌt du ju θɪŋk əˈbaʊt/',
        back: 'O que você acha sobre...?',
        example: 'What do you think about this place?',
        exampleTranslation: 'O que você acha sobre este lugar?',
        tip: 'Em vez de falar só de si, devolver a pergunta mantém o diálogo vivo com mínimo esforço.'
      },
      {
        id: 'en-11',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: 'It depends on the situation',
        phonetic: '/ɪt dɪˈpɛndz ɑn ðə ˌsɪtʃuˈeɪʃən/',
        back: 'Depende da situação',
        example: 'Are you going tomorrow? It depends on the weather.',
        exampleTranslation: 'Você vai amanhã? Depende do clima.',
        tip: 'Bloco lexical natural que dá tempo para você pensar na próxima frase.'
      },
      {
        id: 'en-12',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: 'Actually, I think that... / Because of...',
        phonetic: '/ˈæktʃuəli aɪ θɪŋk ðæt/',
        back: 'Na verdade, eu acho que... / Por causa de...',
        example: 'Actually, I think that this way is better.',
        exampleTranslation: 'Na verdade, eu acho que este caminho é melhor.',
        tip: 'Atenção: "Actually" significa "na verdade" (não "atualmente", que é "currently").'
      },
      {
        id: 'en-13',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: 'That makes sense! / I agree with you',
        phonetic: '/ðæt meɪks sɛns/ • /aɪ əˈɡri wɪð ju/',
        back: 'Isso faz sentido! / Eu concordo com você',
        example: 'Oh, I see! That makes sense now.',
        exampleTranslation: 'Ah, entendi! Isso faz sentido agora.',
        tip: 'Reação autêntica que demonstra escuta ativa em qualquer conversa profissional ou casual.'
      },

      // MÓDULO 4: Paul Nation & Swadesh — Alta Frequência, Espaço, Tempo e Sobrevivência
      {
        id: 'en-14',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'Where is the closest...?',
        phonetic: '/wɛr ɪz ðə ˈkloʊsəst/',
        back: 'Onde fica o(a) ... mais próximo(a)?',
        example: 'Where is the closest subway station or pharmacy?',
        exampleTranslation: 'Onde fica a estação de metrô ou farmácia mais próxima?',
        tip: 'Estrutura matriz de localização espacial imediata.'
      },
      {
        id: 'en-15',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'How much does it cost? / How long does it take?',
        phonetic: '/haʊ mʌtʃ dʌz ɪt kɔst/ • /haʊ lɔŋ dʌz ɪt teɪk/',
        back: 'Quanto custa? / Quanto tempo leva?',
        example: 'How long does it take to get there from here?',
        exampleTranslation: 'Quanto tempo leva para chegar lá daqui?',
        tip: 'Cobre as duas variáveis mais importantes do cotidiano: dinheiro (How much) e tempo (How long).'
      },
      {
        id: 'en-16',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'Yesterday I went / Tomorrow I am going to...',
        phonetic: '/ˈjɛstərdeɪ aɪ wɛnt/ • /təˈmɑroʊ aɪ æm ˈɡoʊɪŋ tu/',
        back: 'Ontem eu fui / Amanhã eu vou...',
        example: 'Yesterday I went to work, and tomorrow I am going to rest.',
        exampleTranslation: 'Ontem eu fui trabalhar, e amanhã eu vou descansar.',
        tip: 'Ancorar o passado ("went") e o futuro ("going to") permite narrar sua vida inteira.'
      },
      {
        id: 'en-17',
        category: 'Alta Frequência',
        theorist: 'Alexander Arguelles',
        front: 'There is a problem / Everything is fine',
        phonetic: '/ðɛr ɪz ə ˈprɑbləm/ • /ˈɛvriˌθɪŋ ɪz faɪn/',
        back: 'Há um problema / Está tudo bem',
        example: 'Don\'t worry, everything is fine right now.',
        exampleTranslation: 'Não se preocupe, está tudo bem agora.',
        tip: '"There is / There are" é a estrutura de existência mais frequente do idioma.'
      },
      {
        id: 'en-18',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (GSL Top 100)',
        front: 'Before / After / While / Already',
        phonetic: '/bɪˈfɔr/ • /ˈæftər/ • /waɪl/ • /ɔlˈrɛdi/',
        back: 'Antes / Depois / Enquanto / Já',
        example: 'I already ate before coming here.',
        exampleTranslation: 'Eu já comi antes de vir para cá.',
        tip: 'Conectores temporais de altíssima frequência que unem frases simples em ideias completas.'
      },

      // MÓDULO 5: Trabalho & Rotina (Vocabulário Profissional & Dia a Dia)
      {
        id: 'en-19',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Take over a shift',
        phonetic: '/teɪk ˈoʊvər ə ʃɪft/',
        back: 'Assumir um turno',
        example: 'I grab a coffee before I take over the shift.',
        exampleTranslation: 'Eu pego um café antes de assumir o turno.',
        tip: '"Take over" significa assumir o controle ou a responsabilidade no lugar de outra pessoa (ex.: troca de turno).'
      },
      {
        id: 'en-20',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Run smoothly',
        phonetic: '/rʌn ˈsmuðli/',
        back: 'Rodar sem problemas / fluir bem',
        example: 'Everything is running smoothly.',
        exampleTranslation: 'Tudo está rodando sem problemas / fluindo bem.',
        tip: 'Muito usado para operações, máquinas, projetos e turnos. No presente contínuo: "is running smoothly".'
      },
      {
        id: 'en-21',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Keep an eye on',
        phonetic: '/kip æn aɪ ɑn/',
        back: 'Ficar de olho em',
        example: 'Keep an eye on the contractors.',
        exampleTranslation: 'Fique de olho nos terceirizados / contratados.',
        tip: 'Atenção: sempre use "on" — nunca coloque "in" depois! ("Keep an eye ON something/someone").'
      },
      {
        id: 'en-22',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'On schedule',
        phonetic: '/ɑn ˈskɛdʒul/',
        back: 'Dentro do cronograma / no prazo',
        example: 'Our production plan is on schedule.',
        exampleTranslation: 'Nosso plano de produção está dentro do cronograma.',
        tip: 'Compare: "on schedule" (no prazo), "ahead of schedule" (adiantado) e "behind schedule" (atrasado).'
      },
      {
        id: 'en-23',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Grab a coffee / a quick bite',
        phonetic: '/ɡræb ə ˈkɔfi/ • /ə kwɪk baɪt/',
        back: 'Pegar um café rápido / fazer um lanche rápido',
        example: "Let's grab a coffee or a quick bite before the meeting.",
        exampleTranslation: 'Vamos pegar um café ou fazer um lanche rápido antes da reunião.',
        tip: '"Grab" é muito mais natural e informal do que "take" ou "buy" para comida e bebida rápidas no dia a dia.'
      },
      {
        id: 'en-24',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Head out',
        phonetic: '/hɛd aʊt/',
        back: 'Sair / partir',
        example: 'I usually head out at 5 PM.',
        exampleTranslation: 'Eu geralmente saio às 17h.',
        tip: 'Phrasal verb muito usado por nativos no fim do expediente ou ao sair de um lugar ("I\'m going to head out now").'
      },
      {
        id: 'en-25',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Thermal insulation',
        phonetic: '/ˈθɜrməl ˌɪnsəˈleɪʃən/',
        back: 'Isolamento térmico',
        example: "We're installing thermal insulation on the pipelines.",
        exampleTranslation: 'Estamos instalando isolamento térmico nas tubulações.',
        tip: 'Atenção: "insulation" é isolamento físico (térmico/elétrico/acústico); "isolation" é isolamento social ou de área.'
      },
      {
        id: 'en-26',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Year-end maintenance shutdown',
        phonetic: '/jɪr-ɛnd ˈmeɪntənəns ˈʃʌtˌdaʊn/',
        back: 'Parada de manutenção de fim de ano',
        example: 'We are preparing the team for the year-end maintenance shutdown.',
        exampleTranslation: 'Estamos preparando a equipe para a parada de manutenção de fim de ano.',
        tip: 'Em inglês, os modificadores vêm antes do substantivo principal ("shutdown" = parada programada de planta/equipamento).'
      },
      {
        id: 'en-27',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'Break room / Vending machine',
        phonetic: '/breɪk rum/ • /ˈvɛndɪŋ məˈʃin/',
        back: 'Copa (sala de café) / Máquina automática de lanches',
        example: "I'll meet you in the break room by the vending machine.",
        exampleTranslation: 'Te encontro na copa, perto da máquina de lanches.',
        tip: '"Break room" é a sala de descanso/café no trabalho; "vending machine" é a máquina automática de lanches/bebidas.'
      },
      {
        id: 'en-28',
        category: 'Trabalho & Rotina',
        theorist: 'Vocabulário Aplicado',
        front: 'It will continue tomorrow',
        phonetic: '/ɪt wɪl kənˈtɪnju təˈmɑroʊ/',
        back: 'Vai continuar amanhã',
        example: 'The inspection stopped for today, but it will continue tomorrow.',
        exampleTranslation: 'A inspeção parou por hoje, mas vai continuar amanhã.',
        tip: 'Atenção: nunca use "be" depois de "will" antes de um verbo principal! Diga "It will continue" (sem "be").'
      }
    ]
  },

  es: {
    id: 'es',
    name: 'Espanhol',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechLang: 'es-ES',
    accentColor: '#fb7185',
    cards: [
      // MÓDULO 1: Michel Thomas & Pimsleur — Núcleo Modal de Intenção
      {
        id: 'es-1',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'Quiero ir / Quiero comer algo',
        phonetic: '/ˈkje.ɾo iɾ/ • /ˈkje.ɾo koˈmeɾ ˈal.ɣo/',
        back: 'Quero ir / Quero comer algo',
        example: 'Quiero comer algo típico de aquí, por favor.',
        exampleTranslation: 'Quero comer algo típico daqui, por favor.',
        tip: 'Em espanhol, o pronome "Yo" é quase sempre omitido. "Quiero + infinitivo" resolve desejos na hora.'
      },
      {
        id: 'es-2',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'Necesito saber / Necesito encontrar',
        phonetic: '/ne.θeˈsi.to saˈβeɾ/ • /en.konˈtɾaɾ/',
        back: 'Preciso saber / Preciso encontrar',
        example: 'Necesito encontrar una farmacia abierta ahora.',
        exampleTranslation: 'Preciso encontrar uma farmácia aberta agora.',
        tip: 'Atenção: em espanhol usa-se "Necesito" (e quase nunca "Preciso") para dizer "eu preciso".'
      },
      {
        id: 'es-3',
        category: 'Núcleo de Intenção',
        theorist: 'Método Pimsleur',
        front: '¿Me puedes ayudar, por favor?',
        phonetic: '/me ˈpwe.ðes a.ʝuˈðaɾ poɾ faˈβoɾ/',
        back: 'Você pode me ajudar, por favor?',
        example: 'Disculpa, ¿me puedes ayudar con esta dirección?',
        exampleTranslation: 'Com licença, pode me ajudar com este endereço?',
        tip: '"Disculpa" ou "Perdona" + "¿Me puedes...?" abre qualquer conversa na rua com simpatia.'
      },
      {
        id: 'es-4',
        category: 'Núcleo de Intenção',
        theorist: 'Método Michel Thomas',
        front: 'Tengo que irme ahora / Tengo que hacer esto',
        phonetic: '/ˈteŋ.ɡo ke ˈiɾ.me aˈo.ɾa/',
        back: 'Tenho que ir embora agora / Tenho que fazer isto',
        example: 'Lo siento, tengo que irme ahora porque es tarde.',
        exampleTranslation: 'Sinto muito, tenho que ir embora agora porque é tarde.',
        tip: '"Tener que + infinitivo" é a estrutura universal de obrigação em espanhol.'
      },
      {
        id: 'es-5',
        category: 'Núcleo de Intenção',
        theorist: 'Método Pimsleur',
        front: 'Me gustaría pedir / Quisiera esto',
        phonetic: '/me ɣus.taˈɾi.a peˈðiɾ/ • /kiˈsje.ɾa ˈes.to/',
        back: 'Eu gostaria de pedir / Eu quereria isto (educado)',
        example: 'Hola, me gustaría pedir la cuenta, por favor.',
        exampleTranslation: 'Olá, eu gostaria de pedir a conta, por favor.',
        tip: '"Me gustaría" e "Quisiera" são as chaves de ouro da cortesia em restaurantes e hotéis.'
      },

      // MÓDULO 2: Krashen & Negociação de Significado
      {
        id: 'es-6',
        category: 'Negociação de Sentido',
        theorist: 'Stephen Krashen (i+1)',
        front: '¿Puedes hablar más despacio, por favor?',
        phonetic: '/ˈpwe.ðes aˈβlaɾ mas desˈpa.θjo/',
        back: 'Você pode falar mais devagar, por favor?',
        example: 'Todavía estoy aprendiendo. ¿Puedes hablar más despacio?',
        exampleTranslation: 'Ainda estou aprendendo. Pode falar mais devagar?',
        tip: 'Falso cognato evitado: "devagar" em espanhol é "despacio" ou "lento". ("Todavía" = "ainda"!).'
      },
      {
        id: 'es-7',
        category: 'Negociação de Sentido',
        theorist: 'Stephen Krashen (i+1)',
        front: '¿Qué significa eso? / ¿Cómo se dice...?',
        phonetic: '/ke siɣ.niˈfi.ka ˈe.so/ • /ˈko.mo se ˈði.θe/',
        back: 'O que significa isso? / Como se diz...?',
        example: 'Perdón, ¿qué significa esa palabra exactamente?',
        exampleTranslation: 'Perdão, o que significa essa palavra exatamente?',
        tip: 'Permite que o próprio falante nativo seja seu professor durante a conversa.'
      },
      {
        id: 'es-8',
        category: 'Negociação de Sentido',
        theorist: 'Paul Pimsleur',
        front: 'Entiendo casi todo, pero hablo un poco',
        phonetic: '/enˈtjen.do ˈka.si ˈto.ðo ˈpe.ɾo ˈa.βlo um ˈpo.ko/',
        back: 'Entendo quase tudo, mas falo um pouco',
        example: 'Entiendo casi todo lo que dices, pero hablo despacio.',
        exampleTranslation: 'Entendo quase tudo o que você diz, mas falo devagar.',
        tip: 'Para falantes de português, esta frase explica perfeitamente sua assimetria inicial entre escuta e fala.'
      },

      // MÓDULO 3: Michael Lewis — Lexical Chunks & Falsos Amigos Críticos
      {
        id: 'es-9',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: '¿Qué te parece esto? / A mí me parece que...',
        phonetic: '/ke te paˈɾe.θe ˈes.to/',
        back: 'O que você acha disto? / Para mim parece que...',
        example: 'A mí me parece una excelente idea, ¿y a ti?',
        exampleTranslation: 'Para mim parece uma excelente ideia, e para você?',
        tip: 'Em espanhol, usa-se muito mais "¿Qué te parece?" do que "¿Qué achás?" (não existe "achar" nesse sentido).'
      },
      {
        id: 'es-10',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: 'En realidad / Sin embargo / Por eso',
        phonetic: '/en re.a.liˈðað/ • /sin emˈbaɾ.ɣo/ • /poɾ ˈe.so/',
        back: 'Na verdade / No entanto (porém) / Por isso',
        example: 'Estaba cansado; sin embargo, fui a trabajar.',
        exampleTranslation: 'Estava cansado; no entanto, fui trabalhar.',
        tip: 'Conectores de coesão que elevam sua fala do nível básico para o nível articulado instantaneamente.'
      },
      {
        id: 'es-11',
        category: 'Chunks de Fluência',
        theorist: 'Michael Lewis (Lexical Approach)',
        front: '¡Claro que sí! / Tiene mucho sentido',
        phonetic: '/ˈkla.ɾo ke si/ • /ˈtje.ne ˈmu.tʃo senˈti.ðo/',
        back: 'Claro que sim! / Faz muito sentido',
        example: '¡Ah, vale! Ahora tiene mucho sentido para mí.',
        exampleTranslation: 'Ah, ok! Agora faz muito sentido para mim.',
        tip: '"Vale" (Espanha) ou "Dale / Claro" (América Latina) + "Tiene sentido" (literalmente "tem sentido").'
      },
      {
        id: 'es-12',
        category: 'Chunks de Fluência',
        theorist: 'Análise Contrastiva PT-ES',
        front: 'Estou procurando = Estoy buscando (não "procurando")',
        phonetic: '/esˈtoj busˈkan.do/',
        back: 'Estou procurando / Enquanto = Mientras',
        example: 'Estoy buscando mi hotel mientras hablo contigo.',
        exampleTranslation: 'Estou procurando meu hotel enquanto falo com você.',
        tip: 'Supera os dois bloqueios mais comuns de brasileiros falando espanhol ("buscar" e "mientras").'
      },

      // MÓDULO 4: Paul Nation — Alta Frequência, Tempo e Espaço
      {
        id: 'es-13',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: '¿Dónde está el/la ... más cercano(a)?',
        phonetic: '/ˈdon.de esˈta el mas θeɾˈka.no/',
        back: 'Onde fica o(a) ... mais próximo(a)?',
        example: '¿Dónde está la estación de metro más cercana?',
        exampleTranslation: 'Onde fica a estação de metrô mais próxima?',
        tip: 'Lembre-se: "Cerca" = perto; "Lejos" = longe. Essencial para deslocamento urbano.'
      },
      {
        id: 'es-14',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: '¿Cuánto cuesta esto? / ¿Cuánto tiempo tarda?',
        phonetic: '/ˈkwan.to ˈkwes.ta ˈes.to/ • /ˈkwan.to ˈtjem.po ˈtaɾ.ða/',
        back: 'Quanto custa isto? / Quanto tempo demora?',
        example: '¿Cuánto tiempo tarda el autobús en llegar al centro?',
        exampleTranslation: 'Quanto tempo demora o ônibus para chegar ao centro?',
        tip: 'Domine preço ("cuesta") e duração ("tarda / demora") em qualquer viagem ou negociação.'
      },
      {
        id: 'es-15',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'Ayer fui / Hoy estoy / Mañana voy a...',
        phonetic: '/aˈʝeɾ fwi/ • /oj esˈtoj/ • /maˈɲa.na boj a/',
        back: 'Ontem fui / Hoje estou / Amanhã vou...',
        example: 'Ayer fui al museo y mañana voy a conocer la playa.',
        exampleTranslation: 'Ontem fui ao museu e amanhã vou conhecer a praia.',
        tip: 'Tríade temporal completa para contar histórias no passado, presente e futuro imediato.'
      },
      {
        id: 'es-16',
        category: 'Alta Frequência',
        theorist: 'Alexander Arguelles',
        front: 'Hay un lugar cerca / No hay ningún problema',
        phonetic: '/aj un luˈɣaɾ ˈθeɾ.ka/ • /no aj niŋˈɡun pɾoˈβle.ma/',
        back: 'Há (tem) um lugar perto / Não há nenhum problema',
        example: 'Tranquilo, no hay ningún problema con eso.',
        exampleTranslation: 'Tranquilo, não tem nenhum problema com isso.',
        tip: '"Hay" (pronuncia-se /ai/) significa "há/existe/tem" impessoal. Nunca use "tiene" para dizer "tem gente".'
      },
      {
        id: 'es-17',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'Todavía no / Ya está listo / Casi siempre',
        phonetic: '/to.ðaˈβi.a no/ • /ʝa esˈta ˈlis.to/ • /ˈka.si ˈsjem.pɾe/',
        back: 'Ainda não / Já está pronto / Quase sempre',
        example: 'Todavía no he comido, pero la cena ya está lista.',
        exampleTranslation: 'Ainda não comi, mas o jantar já está pronto.',
        tip: 'Dois falsos amigos vitais dominados numa só frase: "Todavía" (ainda) e "estar listo" (estar pronto).'
      },
      {
        id: 'es-18',
        category: 'Alta Frequência',
        theorist: 'Paul Nation (Core Vocabulary)',
        front: 'Temprano / Tarde / Antes / Después',
        phonetic: '/temˈpɾa.no/ • /ˈtaɾ.ðe/ • /ˈan.tes/ • /desˈpwes/',
        back: 'Cedo / Tarde / Antes / Depois',
        example: 'Prefiero salir temprano antes de que haya tráfico.',
        exampleTranslation: 'Prefiro sair cedo antes que haja trânsito.',
        tip: '"Temprano" (cedo) e "Después" (depois) aparecem em quase toda combinação de horários.'
      }
    ]
  }
};
