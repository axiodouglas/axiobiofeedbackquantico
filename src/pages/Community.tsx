import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search, MessageSquare, Lock, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Category = "todos" | "saude" | "financeiro" | "relacionamento" | "conquistas";

interface Post {
  id: string;
  author: string;
  category: Category;
  content: string;
  likes: number;
  liked: boolean;
  date: string;
}

const categoryLabels: Record<Category, string> = {
  todos: "Todos",
  saude: "Saúde",
  financeiro: "Financeiro",
  relacionamento: "Relacionamento",
  conquistas: "Conquistas",
};

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Maria S.",
    category: "financeiro",
    content: "Depois de usar os comandos quânticos por 3 semanas, consegui minha primeira promoção em 5 anos! A reprogramação de crenças limitantes sobre dinheiro realmente funciona.",
    likes: 24,
    liked: false,
    date: "02/02/2026",
  },
  {
    id: "2",
    author: "João P.",
    category: "saude",
    content: "Minha ansiedade reduziu drasticamente após o diagnóstico raiz. Descobrir que meu padrão vinha da linhagem paterna foi transformador.",
    likes: 18,
    liked: false,
    date: "01/02/2026",
  },
  {
    id: "3",
    author: "Ana L.",
    category: "relacionamento",
    content: "Finalmente entendi por que repetia os mesmos padrões nos relacionamentos. O A.X.I.O. mostrou bloqueios que eu nem sabia que existiam.",
    likes: 31,
    liked: false,
    date: "30/01/2026",
  },
  {
    id: "4",
    author: "Carlos M.",
    category: "conquistas",
    content: "6 meses usando o A.X.I.O. e minha frequência vibracional subiu de 200 para 450 na escala de Hawkins! Gratidão por essa ferramenta incrível.",
    likes: 42,
    liked: false,
    date: "28/01/2026",
  },
  {
    id: "5",
    author: "Fernanda R.",
    category: "saude",
    content: "As meditações quânticas semanais me ajudaram a dormir melhor e ter mais energia durante o dia. Recomendo demais!",
    likes: 15,
    liked: false,
    date: "25/01/2026",
  },
];

// Set to true for preview/testing, false for production
const IS_PREVIEW = true;

const Community = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<Category>("conquistas");
  const isPremium = IS_PREVIEW; // In production, check user subscription

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "todos" || post.category === selectedCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleNewPost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: "Você",
      category: newPostCategory,
      content: newPost,
      likes: 0,
      liked: false,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-background noise">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button variant="ghost" onClick={() => navigate("/terms")} className="text-sm text-muted-foreground">
            Termos e Obrigações
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Comunidade A.X.I.O.</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Comunidade de Elevação de Frequência
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Relatos reais de transformação. Compartilhe suas conquistas e inspire outros
              a elevar sua frequência vibracional.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar relatos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(categoryLabels) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* New Post (Premium) */}
          {isPremium && (
            <div className="bg-card border border-primary/30 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Compartilhe seu relato
              </h3>
              <Textarea
                placeholder="Conte sua história de transformação..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-3 min-h-[80px]"
              />
              <div className="flex items-center gap-3">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as Category)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="saude">Saúde</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="relacionamento">Relacionamento</option>
                  <option value="conquistas">Conquistas</option>
                </select>
                <Button variant="cyan" size="sm" onClick={handleNewPost}>
                  Publicar
                </Button>
              </div>
            </div>
          )}

          {/* Inspiração Quântica */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Inspiração Quântica
            </h2>
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                  JD
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Dr. Joe Dispenza</h3>
                  <span className="text-[11px] text-muted-foreground">Neurocientista &amp; Autor</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Em 1986, Joe Dispenza foi atropelado por um carro durante uma competição de triatlo. O acidente
                destruiu 6 vértebras da sua coluna. Os médicos foram unânimes: ele precisaria de uma cirurgia com
                implante de hastes metálicas — e mesmo assim, provavelmente nunca mais andaria normalmente.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Joe recusou a cirurgia. Em vez disso, decidiu usar exclusivamente o poder da sua mente para se curar.
                Durante 9 semanas e meia, deitado de bruços, ele dedicou horas por dia a um único exercício:
                <span className="text-primary font-medium"> reconstruir mentalmente sua coluna, vértebra por vértebra,
                enviando comandos claros e repetitivos ao seu corpo.</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ele visualizava cada vértebra se realinhando, o tecido se regenerando, os nervos se reconectando.
                Quando pensamentos de medo ou dúvida surgiam, ele voltava ao comando mental. Seu mantra era simples:
                <span className="italic text-foreground"> &quot;Se eu consigo pensar nisso, meu corpo consegue executar.&quot;</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Em 10 semanas, Joe estava de pé. Em 12 semanas, voltou a treinar. Sem cirurgia. Sem hastes metálicas.
                Apenas o poder da mente sobre a matéria. Hoje, ele ensina milhões de pessoas ao redor do mundo a usar
                a mesma técnica de reprogramação mental para curar doenças, superar traumas e transformar suas vidas.
              </p>
              <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 mt-2">
                <p className="text-xs text-primary italic text-center">
                  &quot;Seu corpo não sabe a diferença entre uma experiência real e uma que você cria mentalmente com a mesma intensidade emocional.&quot;
                  <span className="block text-[10px] text-primary/70 mt-1">— Dr. Joe Dispenza</span>
                </p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-xl p-5 transition-all hover:border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {post.author[0]}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{post.author}</span>
                      <span className="text-xs text-muted-foreground ml-2">{post.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary rounded-full px-2 py-0.5">
                    {categoryLabels[post.category]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.content}</p>
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    post.liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                  {post.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
