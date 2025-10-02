'use client';

// ============================================================================
// IMPORTAÇÕES
// ============================================================================
import { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import Particles from 'react-particles';
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import CountUp from 'react-countup';
import { 
    FaBrain, FaRocket, FaCheck, FaChevronDown, FaChevronUp, FaUserGraduate, 
    FaShieldAlt, FaBullseye, FaPenFancy, FaGraduationCap, FaMedal, FaTrophy,
    FaVolumeUp, FaArrowLeft, FaArrowRight, FaQuoteLeft 
} from 'react-icons/fa';

// --- CORREÇÃO DE TIPAGEM (any) ---
// 1. Declaramos tipos globais para que o TypeScript "conheça" a API do YouTube,
//    que é carregada de um script externo.
declare global {
  interface Window {
    YT: {
      Player: new (id: string, options: object) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// 2. Criamos uma interface para o Player, especificando apenas os métodos que vamos usar.
//    Isso torna nosso código mais seguro e claro.
interface YTPlayer {
  unMute: () => void;
}
// --- FIM DA CORREÇÃO ---


// ============================================================================
// COMPONENTE PRINCIPAL DA LANDING PAGE
// ============================================================================
export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [currentPrint, setCurrentPrint] = useState(0);
    
    // --- LÓGICA DO VÍDEO COM TIPAGEM CORRIGIDA ---
    // 3. Usamos nossa interface YTPlayer para a tipagem do estado 'player'.
    const [player, setPlayer] = useState<YTPlayer | null>(null);
    const [isVideoMuted, setIsVideoMuted] = useState(true);

    const handleUnmute = () => {
        if (player) {
            player.unMute();
            setIsVideoMuted(false);
        }
    };
    
    useEffect(() => {
        const createPlayer = () => {
            // A verificação 'window.YT' agora é entendida pelo TypeScript devido ao 'declare global'
            if (window.YT && document.getElementById('youtube-player-container') && !document.getElementById('youtube-player-container')?.hasChildNodes()) {
                // A variável 'newPlayer' estava com aviso de "não utilizada", então a removemos
                // pois não precisamos dela depois de criar o Player.
                new window.YT.Player('youtube-player-container', {
                    videoId: '3TR8A0AV-2M', // ID do seu vídeo
                    playerVars: {
                        autoplay: 1, mute: 1, controls: 1, loop: 1,
                        playlist: '3TR8A0AV-2M', rel: 0, modestbranding: 1,
                    },
                    events: {
                        // 4. Especificamos o tipo do parâmetro 'event' para evitar o 'any'.
                        'onReady': (event: { target: YTPlayer }) => {
                            setPlayer(event.target);
                        },
                    },
                });
            }
        };

        // A lógica abaixo garante que o player seja criado assim que a API do YouTube estiver pronta.
        if (typeof window.YT !== 'undefined' && typeof window.YT.Player !== 'undefined') {
            createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = createPlayer;
        }

    }, []);
    // --- FIM DA LÓGICA DO VÍDEO ---

     // --- NOVO: LISTA DE PRINTS DOS DEPOIMENTOS ---
    const printsDepoimentos = [
        {
            id: 1,
            image: "/depoimentos/depoimento-1.jpeg",
            alt: "Depoimento de aluno satisfeito com o IA Gabaritei",
            description: "Aluno relatando melhora significativa nas notas"
        },
        
        {
            id: 2, 
            image: "/depoimentos/depoimento-2.jpeg",
            alt: "Conversa mostrando aprovação de aluno",
            description: "Comemoração de aprovação após usar a plataforma"
        },
        {
            id: 3,
            image: "/depoimentos/depoimento-3.jpeg",
            alt: "Feedback positivo sobre o método",
            description: "Aluno destacando a eficácia do plano de estudos"
        },
        {
            id: 4,
            image: "/depoimentos/depoimento-4.jpeg", 
            alt: "Relato de experiência positiva",
            description: "Depoimento sobre a transformação no aprendizado"
        },
        {
            id: 5,
            image: "/depoimentos/depoimento-5.jpeg",
            alt: "Conversa de agradecimento",
            description: "Aluno agradecendo pelos resultados obtidos"
        },

        {
            id: 6,
            image: "/depoimentos/depoimento-6.jpeg",
            alt: "Depoimento de aluno satisfeito com o IA Gabaritei",
            description: "Aluno relatando melhora significativa nas notas"
        }
        
        
    ];

    // --- NOVO: FUNÇÕES PARA NAVEGAR NO CARROSSEL ---
    const nextPrint = () => {
        setCurrentPrint((prev) => (prev + 1) % printsDepoimentos.length);
    };

    const prevPrint = () => {
        setCurrentPrint((prev) => (prev - 1 + printsDepoimentos.length) % printsDepoimentos.length);
    };
    
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // O aviso de 'container' não utilizado é apenas um alerta de qualidade.
        // Como a função é exigida pela biblioteca mas não usamos o parâmetro,
        // podemos simplesmente ignorar o aviso sem problemas.
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        // Carrega o script da API do YouTube se ainda não foi carregado
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        // Configura o timer para zerar à meia-noite
        const timer = setInterval(() => {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            
            const difference = endOfDay.getTime() - now.getTime();
            
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        // --- NOVO: AUTO-ROTAÇÃO DO CARROSSEL ---
        const carouselInterval = setInterval(() => {
            setCurrentPrint((prev) => (prev + 1) % printsDepoimentos.length);
        }, 5000); // Muda a cada 5 segundos

        return () => {
            clearInterval(timer);
            clearInterval(carouselInterval); // Limpa o intervalo do carrossel também
        };
    }, []);
    
    const faqItems = [
        { q: "Isso funciona mesmo se eu trabalho e estudo?", a: "Absolutamente! A IA foi projetada para otimizar seu tempo. Ela cria um plano de estudos que se encaixa na sua rotina, focando apenas no que é essencial para você ser aprovado, eliminando horas de estudo improdutivo." },
        { q: "E se eu não gostar da plataforma?", a: "Seu risco é zero. Você tem nossa Garantia Incondicional de 7 Dias. Se por qualquer motivo você não sentir que esta é a ferramenta que vai te levar à aprovação, basta nos enviar um e-mail e nós devolveremos 100% do seu investimento." },
        { q: "Preciso ser um expert em tecnologia?", a: "De forma alguma. A plataforma é mais fácil de usar que uma rede social. O foco é total no seu aprendizado, sem complicações técnicas. Se você sabe clicar, você sabe usar a IA Gabaritei." },
        { q: "Em quanto tempo vejo os primeiros resultados?", a: "Nossos alunos relatam um aumento de clareza e organização na primeira semana. Em 30 dias, muitos já percebem uma melhora significativa na resolução de questões e na retenção de conteúdo." }
    ];

    return (
        <div className="bg-[#121212] text-white font-sans overflow-x-hidden relative">
            {/* Efeito de partículas no fundo */}
            <div className="fixed inset-0 -z-10 opacity-20">
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={{ /* ... suas opções de partículas ... */ }}
                />
            </div>

            {/* Elementos decorativos fixos */}
            <div className="fixed top-1/4 left-5 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

            <main className="relative z-10">
           
                {/* ======================================= */}
                {/* SEÇÃO 1: HEADLINE E VÍDEO DE VENDAS     */}
                {/* ======================================= */}
                <section className="text-center pt-20 pb-12 relative">
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-10">
                        <FaGraduationCap className="text-9xl" />
                    </div>
                    
                    <div className="container mx-auto px-6" data-aos="fade-up">
                        <div className="inline-flex items-center bg-cyan-900/30 px-4 py-2 rounded-full mb-6 text-cyan-400 text-sm border border-cyan-500/30">
                            <FaMedal className="mr-2" /> Plataforma Nº 1 para Aprovação no ENEM 2023/2024
                        </div>
                        
                        {/* --- CORREÇÃO DAS ASPAS --- */}
                        {/* Aqui, as aspas duplas foram substituídas pelo código &quot; para serem aceitas pelo React. */}
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
                            De <span className="line-through text-red-400">&quot;acho que não vou conseguir&quot;</span> para <span className="text-cyan-400">&quot;essa vaga é minha&quot;</span> em 60 dias
                        </h1>

                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                            Conheça o método que já ajudou mais de <span className="font-bold text-cyan-400">3.742 estudantes</span> a conquistarem aprovação mesmo começando do zero
                        </p>

                        {/* --- INÍCIO: BLOCO DO VÍDEO --- */}
                        <div 
                            className="relative max-w-4xl mx-auto border-2 border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/20 aspect-video overflow-hidden" 
                            data-aos="zoom-in" 
                            data-aos-delay="200"
                        >
                            <div id="youtube-player-container" className="w-full h-full"></div>
                            
                            {isVideoMuted && (
                                <div 
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-10 group"
                                    onClick={handleUnmute}
                                >
                                    <div className="flex flex-col items-center text-white text-center p-4 transition-transform duration-300 group-hover:scale-110">
                                        <FaVolumeUp className="text-5xl sm:text-6xl md:text-8xl" />
                                        <p className="mt-4 font-bold text-md sm:text-lg">CLIQUE PARA ATIVAR O SOM</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* --- FIM: BLOCO DO VÍDEO --- */}
                        
                        <div className="max-w-3xl mx-auto mt-12" data-aos="fade-up" data-aos-delay="300">
                            <h2 className="text-xl md:text-2xl text-gray-300 my-8">
                                Você está cansado de se sentir <strong className="text-white">sobrecarregado</strong>, estudando horas sem ver resultado e com medo de <strong className="text-white">decepcionar todo mundo de novo</strong>?
                            </h2>
                            <a href="#planos" className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-5 px-12 rounded-xl text-xl md:text-2xl uppercase tracking-wider hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30 relative overflow-hidden group">
                                <span className="relative z-10">QUERO MINHA APROVAÇÃO AGORA!</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            <p className="text-sm text-gray-400 mt-3">(E sair na frente de 99% dos candidatos)</p>
                            
                            <div className="flex items-center justify-center mt-8 space-x-2 text-gray-400">
                                <div className="flex -space-x-3">
                                    {/* Este trecho com o map para os avatares foi removido do seu último código, 
                                        então mantive como estava. Se precisar dele de volta, me avise. */}
                                </div>
                                <p className="text-sm"><span className="text-cyan-400">+597</span> APROVAÇÕES ESTE ANO</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ======================================= */}
                {/* --- NOVA SEÇÃO: CARROSSEL DE PRINTS --- */}
                {/* ======================================= */}
                <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                O que Nossos Alunos <span className="text-cyan-400">Realmente Pensam</span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Veja os depoimentos reais de estudantes que transformaram suas vidas com o IA Gabaritei
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                            {/* CARROSSEL DE PRINTS */}
                            <div className="relative bg-gray-800/50 rounded-2xl p-8 border border-cyan-500/30">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-cyan-400">
                                        <FaQuoteLeft className="inline mr-2" />
                                        Depoimentos Reais
                                    </h3>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <span className="text-sm">{currentPrint + 1} / {printsDepoimentos.length}</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    {/* IMAGEM DO PRINT */}
                                    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                                        <img 
                                            src={printsDepoimentos[currentPrint].image}
                                            alt={printsDepoimentos[currentPrint].alt}
                                            className="w-full h-auto max-h-96 object-contain mx-auto"
                                        />
                                    </div>
                                    
                                    {/* DESCRIÇÃO */}
                                    <p className="text-center text-gray-300 mt-4 italic">
                                        {printsDepoimentos[currentPrint].description}
                                    </p>

                                    {/* CONTROLES DO CARROSSEL */}
                                    <button 
                                        onClick={prevPrint}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <button 
                                        onClick={nextPrint}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>

                                {/* INDICADORES */}
                                <div className="flex justify-center mt-6 space-x-2">
                                    {printsDepoimentos.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPrint(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${
                                                index === currentPrint ? 'bg-cyan-400' : 'bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ESTATÍSTICAS ABAIXO DO CARROSSEL */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-cyan-500/20">
                                    <CountUp end={97} suffix="%" className="text-4xl font-bold text-cyan-400 block" />
                                    <p className="text-gray-300 mt-2">Taxa de Satisfação</p>
                                </div>
                                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-cyan-500/20">
                                    <CountUp end={3742} className="text-4xl font-bold text-cyan-400 block" />
                                    <p className="text-gray-300 mt-2">Aprovações Conquistadas</p>
                                </div>
                                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-cyan-500/20">
                                    <CountUp end={94} suffix="%" className="text-4xl font-bold text-cyan-400 block" />
                                    <p className="text-gray-300 mt-2">Indicariam para Amigos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                

                {/* ======================================= */}
{/* SEÇÃO 2: STORYTELLING E PROBLEMA         */}
{/* ======================================= */}
<section className="py-20 bg-gradient-to-b from-gray-900/50 to-gray-950/80 relative">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
    
    <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Lembra daquela <span className="text-cyan-400">sensação no estômago</span> quando saiu a lista de aprovados e seu nome não estava lá?
            </h2>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border-l-4 border-cyan-500 text-left my-10" data-aos="fade-right">
                {/* --- CORREÇÃO DAS ASPAS --- */}
                {/* O texto do depoimento foi envolvido por &quot; no início e no fim. */}
                <p className="text-lg text-gray-300 italic">
                    &quot;Eu estudava 8 horas por dia, abri mão de festas, encontros com amigos, e mesmo assim quando via a prova do ENEM, sentia que todo aquele esforço tinha sido em vão. Até que descobri que o problema não era minha dedicação, mas COMO eu estava estudando.&quot;
                </p>
                <p className="mt-4 text-cyan-400 font-semibold">- Maria Clara, aprovada em Medicina</p>
            </div>
            
            <p className="text-xl text-gray-300">
                A verdade é que <strong className="text-white">não é sobre quanto você estuda, mas como você estuda</strong>. E é aí que a inteligência artificial entra para revolucionar tudo.
            </p>
        </div>
    </div>
</section>

{/* ======================================= */}
{/* SEÇÃO 3: APRESENTAÇÃO DA SOLUÇÃO         */}
{/* ======================================= */}
<section className="py-20 text-center relative">
    <div className="container mx-auto px-6" data-aos="fade-up">
        <h2 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto mb-6">
            Conheça a IA Gabaritei: Seu <span className="text-cyan-400">Professor Particular 24/7</span> que Nunca Cansa e Sabe Exatamente o que Você Precisa
        </h2>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Imagine ter um mentor que conhece suas dificuldades, seus pontos fortes e monta o caminho mais curto entre você e a aprovação
        </p>
    </div>
</section>

{/* ======================================= */}
{/* SEÇÃO 4: FEATURES COMO BENEFÍCIOS       */}
{/* ======================================= */}
<section className="py-12 relative">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
    
    <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BenefitCard 
                icon={<FaBullseye/>}
                title="GPS da Aprovação" 
                description="Chega de se sentir perdido. Nossa IA cria seu mapa de estudos exato, mostrando o que, quando e como estudar para atingir a pontuação máxima no menor tempo possível."
                dataAos="fade-right"
            />
             <BenefitCard 
                icon={<FaPenFancy/>}
                title="Fábrica de Redação Nota 1000" 
                description="Envie suas redações e receba correções detalhadas da nossa IA em minutos, com sugestões de melhoria para você atingir a nota máxima."
                dataAos="fade-left"
            />
             <BenefitCard 
                icon={<FaBrain/>}
                title="Seu Mentor Pessoal 24/7" 
                description="Tire qualquer dúvida, a qualquer hora. Nossa IA explica tópicos complexos, resolve questões e te mantém motivado, como um tutor particular que nunca dorme."
                dataAos="fade-right"
            />
             <BenefitCard 
                icon={<FaRocket/>}
                title="Arsenal de Questões Infinitas" 
                description="Pratique com milhares de questões geradas sob medida para suas dificuldades. A IA identifica seus pontos fracos e cria o treino perfeito para você."
                dataAos="fade-left"
            />
        </div>
    </div>
</section>

{/* ======================================= */}
{/* SEÇÃO 5: O QUE É E COMO USAR (NOVA)     */}
{/* ======================================= */}
<section className="py-20 bg-black/20 relative">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
    
    <div className="container mx-auto px-6">
        <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold">
                Como a IA Vai <span className="text-cyan-400">Transformar</span> Sua Jornada
            </h2>
            <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
                Menos teoria, mais prática. Veja como milhares de estudantes estão usando a tecnologia a seu favor
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <HowToUseCard
                number="01"
                title="Assine e Configure"
                description="Escolha seu plano. Em menos de 5 minutos, você responde a um questionário estratégico para que a IA mapeie seu perfil, suas metas e suas dificuldades."
                dataAos="fade-up"
                dataAosDelay="0"
            />
            <HowToUseCard
                number="02"
                title="Siga seu Plano Diário"
                description="Acesse a plataforma todos os dias e veja seu plano de batalha pronto: quais matérias estudar, quais questões resolver e quando revisar. Sem achismos, apenas execução."
                dataAos="fade-up"
                dataAosDelay="150"
            />
            <HowToUseCard
                number="03"
                title="Interaja e Domine"
                description="Use o chat com o Mentor IA para tirar dúvidas, envie redações para correção e gere simulados personalizados. Quanto mais você usa, mais inteligente a IA fica sobre você."
                dataAos="fade-up"
                dataAosDelay="300"
            />
            <HowToUseCard
                number="04"
                title="Monitore e Vença"
                description="Acompanhe seus gráficos de desempenho em tempo real. Veja suas fraquezas se tornando forças e caminhe com a certeza de que você está no controle da sua aprovação."
                dataAos="fade-up"
                dataAosDelay="450"
            />
        </div>
    </div>
</section>

                {/* ======================================= */}
{/* SEÇÃO 6: PROVA SOCIAL AGRESSIVA         */}
{/* ======================================= */}
<section className="py-20 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-black opacity-50"></div>
    
    <div className="container mx-auto px-6 relative z-10">
         <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold">Eles Usaram a Vantagem Injusta. <span className="text-cyan-400">Veja os Resultados.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
                name="Juliana Moreira" 
                role="Aprovada em Medicina na ESCS" 
                text="O IA Gabaritei foi um divisor de águas. O plano de estudos focado nas minhas dificuldades economizou meses de estudo." 
                dataAos="fade-up" 
            />
            <TestimonialCard 
                name="Carlos Feitosa" 
                role="Aprovado em Direito na UFSC" 
                text="Nunca imaginei que poderia ter um mentor 24h por dia. As questões ilimitadas e o feedback instantâneo foram essenciais." 
                dataAos="fade-up" 
                dataAosDelay="150" 
            />
            <TestimonialCard 
                name="Beatriz Soares" 
                role="Aluna do 3º Ano - ENEM" 
                text="A plataforma me deu a confiança que eu não tinha. Sinto que estou no controle da minha preparação para o ENEM como nunca antes." 
                dataAos="fade-up" 
                dataAosDelay="300" 
            />
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-8 rounded-2xl border border-cyan-500/30" data-aos="zoom-in">
            <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Não é magica, é <span className="text-cyan-400">metodologia</span></h3>
                    <p className="text-gray-300">
                        {/* CORREÇÃO: Pequeno erro de digitação corrigido (comparedo -> comparado) */}
                        Nossos alunos estudam em média <span className="text-cyan-400 font-bold">47% menos tempo</span> e têm <span className="text-cyan-400 font-bold">3,2x mais chances</span> de aprovação comparado aos métodos tradicionais
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                        <CountUp end={97} suffix="%" className="text-3xl font-bold text-cyan-400" />
                        <p className="text-sm mt-2">Taxa de satisfação</p>
                    </div>
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                        <CountUp end={3742} className="text-3xl font-bold text-cyan-400" />
                        <p className="text-sm mt-2">Aprovações</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{/* ======================================= */}
{/* SEÇÃO 7: PLANOS (VERSÃO APRIMORADA)     */}
{/* ======================================= */}
<section id="planos" className="py-24 relative overflow-hidden bg-gray-950">
    {/* Efeito de fundo: um brilho sutil para destacar a seção */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-cyan-500/10 rounded-full blur-3xl -z-0"></div>

    <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
    <div className="inline-flex items-center justify-center bg-cyan-900/50 px-4 py-2 rounded-full mb-6 border border-cyan-500/30">
        <FaShieldAlt className="text-cyan-400 mr-2"/>
        <span className="text-cyan-400 text-sm font-medium">Investimento Seguro</span>
    </div>
    {/* Título principal ainda maior */}
    <h2 className="text-6xl md:text-7xl font-extrabold leading-tight"> {/* <-- MUDANÇA AQUI */}
        Escolha o Plano da <br/> <span className="text-cyan-400">Sua Aprovação</span>
    </h2>
    {/* Subtítulo com mais destaque */}
    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-xl"> {/* <-- MUDANÇA AQUI */}
        O único investimento que separa você do seu nome no Diário Oficial.
    </p>
</div>

        {/* Contêiner dos cards */}
        <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-5xl mx-auto">
            
            {/* Card do Plano Elite */}
            <PlanoCard 
                dataAos="fade-up" 
                dataAosDelay="300" 
                title="Anual Elite" 
                price="R$ 49" 
                priceDetail="/por ano" 
                tag="Aprovação Turbo" 
                featureColor="blue" 
                items={[
                    'Acesso ILIMITADO ao Mentor IA', 
                    'Planos de Estudos DINÂMICOS', 
                    'Questões ILIMITADAS', 
                    'Suporte PREMIUM 24/7', 
                    'Análise Avançada de Desempenho'
                ]} 
                cta="ME TORNAR ELITE"
                link="https://pay.kiwify.com.br/QuDnKAZ"
            />
            
            {/* Card do Plano Premium+ */}
            <PlanoCard 
                dataAos="fade-up" 
                dataAosDelay="150" 
                title="Anual Premium +" 
                price="R$ 79" 
                priceDetail="/por ano" 
                tag="MAIS VENDIDO!" 
                isFeatured={true} 
                items={[
                    'TUDO do Premium +', 
                    'Sessões de Mentoria Humana', 
                    'Revisões Inteligentes com IA', 
                    'Simulação de Redações com Feedback'
                ]} 
                cta="QUERO O PREMIUM ANUAL" 
                link="https://pay.kiwify.com.br/hq9rvpK"
            />

        </div>
    </div>
</section>
{/* ======================================= */}
{/* SEÇÃO 8: GARANTIA INCONDICIONAL         */}
{/* ======================================= */}
<section className="py-20 relative">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2064')] bg-cover bg-center opacity-10"></div>
    
    <div className="container mx-auto px-6 max-w-3xl text-center relative z-10" data-aos="zoom-in">
        <FaShieldAlt className="text-7xl text-cyan-400 mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold">Sua Aprovação Garantida ou <br/>Seu Dinheiro 100% de Volta.</h2>
        <p className="text-lg text-gray-300 mt-6">
            É isso mesmo. Você tem 7 dias para testar absolutamente tudo na IA Gabaritei. Se você não sentir uma transformação completa na sua forma de estudar, ou simplesmente não gostar por qualquer motivo, aperte um botão e nós devolveremos cada centavo do seu investimento. Sem perguntas, sem burocracia. O risco é todo nosso.
        </p>
        
        <div className="mt-10 p-6 bg-gray-800/50 rounded-xl border border-cyan-500/30 text-left">
            <div className="flex items-start">
                <FaTrophy className="text-3xl text-cyan-400 mr-4 mt-1" />
                <div>
                    <h3 className="text-xl font-bold mb-2">Bônus Exclusivo por Tempo Limitado</h3>
                    {/* --- CORREÇÃO DAS ASPAS --- */}
                    <p className="text-gray-300">
                        Ao assinar hoje, você recebe <span className="text-cyan-400">GRATUITAMENTE</span> o módulo &quot;Mentalidade de Aprovado&quot; com técnicas comprovadas para controlar a ansiedade e maximizar seu desempenho no dia da prova.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

{/* ======================================= */}
{/* SEÇÃO 8: FAQ (QUEBRA DE OBJEÇÕES)       */}
{/* ======================================= */}
<section className="py-20 bg-black/20">
    <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold">Suas Últimas Dúvidas, Resolvidas.</h2>
        </div>
        <div className="space-y-4">
            {faqItems.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg" data-aos="fade-up" data-aos-delay={index * 100}>
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-5 font-semibold text-lg">
                        {item.q}
                        {openFaq === index ? <FaChevronUp className="text-cyan-400" /> : <FaChevronDown />}
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                        <p className="p-5 pt-0 text-gray-400">{item.a}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>

                {/* ======================================= */}
{/* SEÇÃO 9: ÚLTIMA CHAMADA (CTA)           */}
{/* ======================================= */}
<section className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-black opacity-30"></div>
    
    <div className="container mx-auto px-6 max-w-3xl text-center relative z-10" data-aos="zoom-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Sua Vaga no Pódio Está Expirando...</h2>
        <p className="text-gray-400 mb-6 text-lg">Esta oferta especial e os bônus inclusos terminam em:</p>
        
        {/* Contador de Escassez */}
        <div className="flex justify-center gap-4 text-center mb-8">
            <div className="bg-gray-800 p-4 rounded-lg w-24">
                <span className="text-4xl font-bold text-cyan-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-sm text-gray-400">Horas</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg w-24">
                <span className="text-4xl font-bold text-cyan-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-sm text-gray-400">Minutos</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg w-24">
                <span className="text-4xl font-bold text-cyan-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-sm text-gray-400">Segundos</span>
            </div>
        </div>
        
        <a href="#planos" className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-5 px-12 rounded-xl text-xl md:text-2xl uppercase tracking-wider hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30 relative overflow-hidden group">
            <span className="relative z-10">SIM, EU QUERO SER APROVADO!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
         <p className="text-sm text-gray-400 mt-3">Vagas com valor promocional limitadas.</p>
         
         <div className="mt-10 flex items-center justify-center">
            <FaMedal className="text-cyan-400 text-2xl mr-2" />
            <p className="text-sm text-gray-400">Junte-se aos <span className="text-cyan-400">3.742 aprovados</span> que transformaram seus sonhos em realidade</p>
         </div>
    </div>
</section>
</main>
        
        <footer className="bg-black/50 border-t border-gray-800 relative z-10">
            <div className="container mx-auto py-8 px-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} IA Gabaritei. Todos os direitos reservados.</p>
                <div className="mt-4 space-x-4">
                    <a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidade</a>
                    <span>|</span>
                    <a href="#" className="hover:text-cyan-400 transition-colors">Termos de Uso</a>
                </div>
            </div>
        </footer>
    </div>
);
}


// ============================================================================
// SUB-COMPONENTES PARA REUTILIZAÇÃO (COM CORREÇÕES)
// ============================================================================

// --- CORREÇÃO DE TIPAGEM (any) ---
// Adicionamos os tipos específicos para as propriedades de cada componente.
// Lembre-se de adicionar 'ReactNode' na sua lista de importações do 'react' no topo do arquivo.
import type { ReactNode } from 'react';

type BenefitCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  dataAos: string;
};

const BenefitCard = ({ icon, title, description, dataAos }: BenefitCardProps) => (
    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex items-start gap-6 hover:border-cyan-500/50 transition-all duration-300 group" data-aos={dataAos}>
        <div className="text-cyan-400 text-4xl mt-1 group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    </div>
);

type HowToUseCardProps = {
  number: string;
  title: string;
  description: string;
  dataAos: string;
  dataAosDelay: string;
};

const HowToUseCard = ({ number, title, description, dataAos, dataAosDelay }: HowToUseCardProps) => (
    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 h-full text-center hover:border-cyan-500/50 transition-all duration-300 group" data-aos={dataAos} data-aos-delay={dataAosDelay}>
        <div className="text-6xl font-extrabold text-cyan-400/20 mb-4 group-hover:text-cyan-400/30 transition-colors">{number}</div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

// O tipo das propriedades
type PlanoCardProps = {
  title: string;
  price: string;
  priceDetail: string;
  items: string[];
  tag?: string;
  isFeatured?: boolean;
  featureColor?: string;
  cta: string;
  dataAos: string;
  dataAosDelay: string;
  link: string; // <-- 1. ADICIONE ESTA LINHA
};

// A definição do card
const PlanoCard = ({ title, price, priceDetail, items, tag, isFeatured, featureColor = 'cyan', cta, dataAos, dataAosDelay, link }: PlanoCardProps) => (
    <div 
        className={`
            bg-gradient-to-br from-gray-900 to-gray-800/90 p-8 rounded-2xl flex flex-col border transition-all duration-300 group
            ${isFeatured 
                ? (featureColor === 'blue' ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-cyan-500 shadow-2xl shadow-cyan-500/20') 
                : 'border-gray-700/50 hover:border-cyan-500/50'
            } 
            relative transform hover:-translate-y-3
        `} 
        data-aos={dataAos} 
        data-aos-delay={dataAosDelay}
    >
        {tag && 
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-4 py-1.5 rounded-full tracking-wider uppercase
                ${isFeatured 
                    ? (featureColor === 'blue' ? 'bg-blue-500' : 'bg-cyan-500') 
                    : 'bg-gray-600'
                }
            `}>{tag}</div>
        }
        
        {/* TÍTULO DO CARD: Aumentado para 4xl */}
        <h3 className="text-4xl font-extrabold mb-4 text-center group-hover:text-cyan-400 transition-colors">{title}</h3>
        
        <div className="text-center my-4">
            <span className="text-2xl font-medium text-gray-400 align-top">R$ </span>
            <span className="text-7xl font-bold tracking-tighter text-white">{price.replace('R$ ', '')}</span>
            <span className="text-lg font-medium text-gray-400">{priceDetail}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-8 text-center">Cobrado anualmente</p>

        {/* LISTA DE BENEFÍCIOS: Texto aumentado para text-lg */}
        <ul className="space-y-4 mb-10 text-gray-300 flex-grow">
            {items.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3 border-b border-gray-700/60 pb-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                </li>
            ))}
        </ul>

        {/* BOTÃO CTA: Texto aumentado para 2xl */}
        <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`
                flex items-center justify-center gap-2 text-center w-full font-bold py-4 px-6 rounded-lg text-2xl transition-all duration-300 shadow-lg
                ${isFeatured 
                    ? (featureColor === 'blue' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30' : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30') 
                    : 'bg-gray-700 hover:bg-gray-600'
                } 
                transform group-hover:scale-105 group-hover:shadow-xl
            `}
        >
            {cta} <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
        </a>
    </div>
);

type TestimonialCardProps = {
  name: string;
  role: string;
  text: string;
  dataAos: string;
  dataAosDelay?: string;
};

const TestimonialCard = ({ name, role, text, dataAos, dataAosDelay }: TestimonialCardProps) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full hover:border-cyan-500/50 transition-all duration-300" data-aos={dataAos} data-aos-delay={dataAosDelay}>
        <div className="flex items-center mb-4">
            <div className="relative">
                <FaUserGraduate className="text-4xl text-cyan-400 mr-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
                <p className="font-bold text-lg">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
            </div>
        </div>
        {/* --- CORREÇÃO DAS ASPAS --- */}
        <p className="text-gray-300 italic">&quot;{text}&quot;</p>
    </div>
);