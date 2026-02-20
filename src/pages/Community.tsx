import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search, MessageSquare, Sparkles } from "lucide-react";
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
    author: "Camila R.",
    category: "conquistas",
    content: "Me fez muito bem. Aprendi coisas sobre mim que nunca tinha parado para enxergar.",
    likes: 34,
    liked: false,
    date: "10/02/2026",
  },
  {
    id: "2",
    author: "Lucas M.",
    category: "saude",
    content: "A meditação é incrível. Depois que comecei a ouvir o áudio antes de dormir, meu sono melhorou muito.",
    likes: 27,
    liked: false,
    date: "11/02/2026",
  },
  {
    id: "3",
    author: "Fernanda A.",
    category: "saude",
    content: "Tinha um medo enorme de dirigir desde um susto que levei anos atrás. Com a meditação consegui acalmar esse trauma. Hoje dirijo tranquila.",
    likes: 41,
    liked: false,
    date: "12/02/2026",
  },
  {
    id: "4",
    author: "Rafael T.",
    category: "conquistas",
    content: "O diagnóstico foi surpreendente. Identificou exatamente o que eu sentia mas não conseguia nomear.",
    likes: 19,
    liked: false,
    date: "12/02/2026",
  },
  {
    id: "5",
    author: "Mariana C.",
    category: "relacionamento",
    content: "Entendi padrões que eu repetia nos meus relacionamentos sem perceber. Foi revelador.",
    likes: 23,
    liked: false,
    date: "13/02/2026",
  },
  {
    id: "6",
    author: "Diego P.",
    category: "saude",
    content: "A meditação me ajudou a soltar uma ansiedade que eu já nem lembrava de onde vinha. Sinto o corpo mais leve.",
    likes: 38,
    liked: false,
    date: "14/02/2026",
  },
  {
    id: "7",
    author: "Priscila N.",
    category: "conquistas",
    content: "Gravar a própria voz parece estranho no começo mas é muito poderoso. Me surpreendi com o resultado.",
    likes: 16,
    liked: false,
    date: "15/02/2026",
  },
  {
    id: "8",
    author: "Bruno S.",
    category: "financeiro",
    content: "Tinha uma trava enorme para ganhar dinheiro. Depois do diagnóstico entendi de onde vinha. Mudou minha visão.",
    likes: 29,
    liked: false,
    date: "16/02/2026",
  },
  {
    id: "9",
    author: "Juliana F.",
    category: "saude",
    content: "Aprendi muito sobre mim mesma. A meditação é simples e ao mesmo tempo muito profunda.",
    likes: 45,
    liked: false,
    date: "17/02/2026",
  },
  {
    id: "10",
    author: "Thiago K.",
    category: "conquistas",
    content: "O AXIO me fez parar e olhar para dentro. Foi a coisa mais útil que fiz por mim mesmo em muito tempo.",
    likes: 52,
    liked: false,
    date: "18/02/2026",
  },
];

const IS_PREVIEW = true;

const Community = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<Category>("conquistas");
  const isPremium = IS_PREVIEW;

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
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Comunidade A.X.I.O.</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Comunidade de Transformação
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Relatos reais de quem reprogramou suas crenças limitantes. Compartilhe suas conquistas e inspire outros.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar relatos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>

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

          {isPremium && (
            <div className="bg-card border border-primary/30 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Compartilhe seu relato
              </h3>
              <Textarea placeholder="Conte sua história de transformação..." value={newPost} onChange={(e) => setNewPost(e.target.value)} className="mb-3 min-h-[80px]" />
              <div className="flex items-center gap-3">
                <select value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value as Category)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  <option value="saude">Saúde</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="relacionamento">Relacionamento</option>
                  <option value="conquistas">Conquistas</option>
                </select>
                <Button variant="cyan" size="sm" onClick={handleNewPost}>Publicar</Button>
              </div>
            </div>
          )}

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
