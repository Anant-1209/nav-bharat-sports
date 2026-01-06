import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Menu, 
  X, 
  Trophy, 
  ShieldCheck, 
  Phone,
  Save,
  Image as ImageIcon,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  Crown
} from 'lucide-react';

// NOTE: For local development, place 'logo.jpg' in the 'public' folder of your project.

// --- Firebase Configuration (YOUR CREDENTIALS) ---
const firebaseConfig = {
  apiKey: "AIzaSyBBWiP5lCQqLnWSFSf7HZsHh5rbUz0oV8s",
  authDomain: "nav-bharat-sports.firebaseapp.com",
  projectId: "nav-bharat-sports",
  storageBucket: "nav-bharat-sports.firebasestorage.app",
  messagingSenderId: "220355123120",
  appId: "1:220355123120:web:b4fedfe9d7647255306875",
  measurementId: "G-5VQS7E1RF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

// --- Components ---

// 1. Navigation Bar
const Navbar = ({ 
  toggleAdmin, 
  isAdmin, 
  cartCount,
  toggleCart
}: { 
  toggleAdmin: () => void; 
  isAdmin: boolean; 
  cartCount: number;
  toggleCart: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-xl border-2 border-slate-700 bg-white">
              {/* Make sure to put 'logo.jpg' in your PUBLIC folder! */}
              <img 
                src="/logo.jpg" 
                alt="Nav Bharat" 
                className="h-full w-full object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-full h-full p-2 text-orange-600" ... />';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase italic">Nav Bharat</h1>
              <span className="text-[10px] md:text-xs text-orange-400 tracking-[0.3em] font-bold block -mt-1">SPORTS</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white font-medium transition">Home</a>
            <a href="#shop" className="text-slate-300 hover:text-white font-medium transition">Shop</a>
            <a href="#features" className="text-slate-300 hover:text-white font-medium transition">Why Us</a>
            <a href="#contact" className="text-slate-300 hover:text-white font-medium transition">Contact</a>
            
            <button 
              onClick={toggleAdmin}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md ${isAdmin ? 'bg-orange-600 text-white ring-2 ring-orange-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
              {isAdmin ? 'Admin Active' : 'Owner Login'}
            </button>
            
            <button onClick={toggleCart} className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition group">
              <ShoppingBag size={22} className="text-slate-300 group-hover:text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions (Cart + Menu) */}
          <div className="md:hidden flex items-center space-x-2">
            
            {/* MOBILE CART BUTTON ADDED HERE */}
            <button onClick={toggleCart} className="relative p-2 text-gray-300 hover:text-white mr-2">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300 hover:text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-1">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 text-white">Home</a>
            <a href="#shop" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 text-white">Shop</a>
            <button onClick={toggleAdmin} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-orange-400 hover:bg-slate-700">
              {isAdmin ? 'Exit Admin' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Hero Section
const Hero = () => (
  <div className="relative bg-slate-900 overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
        alt="Sports Equipment"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/30 backdrop-blur-sm">
        <span className="text-orange-400 font-bold text-sm tracking-wider uppercase">Jhansi's Premier Sports Hub</span>
      </div>
      <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
        UNLEASH YOUR <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">INNER CHAMPION</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
        From professional cricket kits to premium fitness gear. Nav Bharat Sports brings you the world's best equipment right here in Jhansi.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#shop" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-600/30 transform transition hover:-translate-y-1 flex items-center justify-center">
          <ShoppingBag className="mr-2" size={20} /> Shop Now
        </a>
        <a href="#contact" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-4 px-10 rounded-full transition flex items-center justify-center">
          Visit Store
        </a>
      </div>
    </div>
  </div>
);

// 3. Features Section
const Features = () => (
  <div id="features" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Why Choose Nav Bharat?</h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">100% Authentic Gear</h3>
          <p className="text-slate-500 leading-relaxed">We are authorized dealers for top brands like SG, SS, Yonex, and Nivia. Quality you can trust.</p>
        </div>
        
        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Best Price Guarantee</h3>
          <p className="text-slate-500 leading-relaxed">Get the most competitive prices in Jhansi. We believe premium sports gear should be accessible.</p>
        </div>

        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Advice</h3>
          <p className="text-slate-500 leading-relaxed">Not sure what bat suits your style? Our experienced team will help you pick the perfect equipment.</p>
        </div>
      </div>
    </div>
  </div>
);

// 4. New Shields Section
const ShieldsSection = () => (
  <div className="bg-slate-900 py-20 text-white relative overflow-hidden border-t border-slate-800">
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-10"></div>
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="text-left md:w-1/2">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Crown size={16} className="text-orange-400" />
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">Tournament Specials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Awards, Trophies & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Winning Shields
            </span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Organizing a cricket tournament or school event? We offer a wide range of premium shields, cups, and medals at unbeatable wholesale prices. 
            <br/><span className="text-white font-medium mt-2 block">Custom engraving available on request.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#shop" className="bg-white text-slate-900 hover:bg-orange-50 font-bold py-3.5 px-8 rounded-full transition flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Check Prices Above <ShoppingBag size={18} className="ml-2"/>
            </a>
            <a href="https://wa.me/917985174679?text=Hi,%20I%20need%20to%20inquire%20about%20bulk%20shields%20and%20trophies." target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3.5 px-8 rounded-full transition flex items-center">
              Bulk Inquiry <Phone size={18} className="ml-2"/>
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
           <div className="relative z-10 grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-2xl shadow-2xl transform rotate-3 flex flex-col items-center justify-center text-center w-40 h-48 border-2 border-yellow-400/30">
                <Trophy size={48} className="text-white mb-2" />
                <span className="font-bold text-white text-lg">Winner Cup</span>
                <span className="text-yellow-100 text-xs mt-1">Starting ₹150</span>
             </div>
             <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6 rounded-2xl shadow-2xl transform -rotate-3 mt-8 flex flex-col items-center justify-center text-center w-40 h-48 border-2 border-slate-600">
                <ShieldCheck size={48} className="text-white mb-2" />
                <span className="font-bold text-white text-lg">Shields</span>
                <span className="text-slate-300 text-xs mt-1">Starting ₹250</span>
             </div>
           </div>
           {/* Decorative glow behind icons */}
           <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-20"></div>
        </div>
      </div>
    </div>
  </div>
);

// 5. Admin Product Form
const ProductForm = ({ 
  onSubmit, 
  editingProduct, 
  onCancel 
}: { 
  onSubmit: (data: any) => void; 
  editingProduct?: Product | null; 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    price: editingProduct?.price || '',
    category: editingProduct?.category || 'Cricket',
    description: editingProduct?.description || '',
    imageUrl: editingProduct?.imageUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800">
          <h2 className="text-white font-bold text-xl flex items-center">
            {editingProduct ? <Edit2 className="mr-3 text-orange-500" size={24} /> : <Plus className="mr-3 text-green-500" size={24} />}
            {editingProduct ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition bg-slate-800 p-2 rounded-full"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition outline-none font-medium"
              placeholder="e.g. MRF Grand Edition Bat"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                <input 
                  required
                  type="number" 
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition outline-none font-bold text-slate-900"
                  placeholder="2500"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition outline-none cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
                <option value="Fitness">Fitness</option>
                <option value="Accessories">Accessories</option>
                <option value="Shields">Shields & Trophies</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Image URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition outline-none text-sm"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
            <textarea 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition outline-none h-28 resize-none"
              placeholder="Enter product details..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transform transition font-bold flex items-center"
            >
              <Save size={20} className="mr-2" /> Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ['All', 'Cricket', 'Football', 'Badminton', 'Fitness', 'Accessories', 'Shields'];

  // --- Auth & Data Fetching ---
  useEffect(() => {
    // Authenticate Anonymously for local usage
    signInAnonymously(auth).catch(err => console.error("Auth Failed", err));
    
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Only fetch if we have a user (even anonymous)
    if (!user) return;
    
    // Note: The path here is simplified for your local database
    // "products" is the collection name at the root of your Firestore
    const q = query(collection(db, 'products'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- CRUD Operations ---
  const handleAddProduct = async (data: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'products'), {
        ...data,
        price: Number(data.price),
        inStock: true,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding product", error);
      alert("Error adding product. Check console for details (likely permissions).");
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (!user || !editingProduct) return;
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        ...data,
        price: Number(data.price)
      });
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // UPDATED PHONE NUMBER
    const phoneNumber = "917985174679";
    const itemsList = cart.map((item, index) => `${index + 1}. ${item.name} (₹${item.price})`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Message to be sent to the owner
    const message = `*New Booking Request*\n\nHello Nav Bharat Sports,\nI would like to book the following items:\n\n${itemsList}\n\n*Total Amount: ₹${total}*\n\nPlease confirm my booking. I will come to collect the items.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and show success message
    setCart([]);
    setShowCart(false);
    setOrderPlaced(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar 
        toggleAdmin={() => setIsAdmin(!isAdmin)} 
        isAdmin={isAdmin}
        cartCount={cart.length}
        toggleCart={() => setShowCart(!showCart)}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              </div>
              <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">Your cart is empty.</p>
                  <button onClick={() => setShowCart(false)} className="text-orange-600 font-bold hover:underline">Start Shopping</button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-slate-200">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-orange-600 font-bold">₹{item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex justify-between mb-6">
                  <span className="text-slate-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-slate-900">₹{cart.reduce((sum, item) => sum + item.price, 0)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-600/20 transition flex items-center justify-center space-x-2"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 invert brightness-0 saturate-100" />
                  <span>Checkout via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Successful!</h3>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              Your item has been booked successfully. Please come and collect your product.
            </p>
            <button 
              onClick={() => setOrderPlaced(false)}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
            >
              Okay, Got it!
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-orange-600 text-white px-4 py-2 text-center text-sm font-bold tracking-wide shadow-md">
          ADMIN MODE ACTIVE • YOU CAN NOW MANAGE INVENTORY
        </div>
      )}

      {!isAdmin && <Hero />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="shop">
        <div className="text-center mb-12">
          <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Our Collection</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Latest Arrivals</h2>
          <div className="w-20 h-1.5 bg-slate-900 mx-auto rounded-full"></div>
        </div>

        {/* Controls Header */}
        <div className="sticky top-20 z-30 bg-slate-50/95 backdrop-blur py-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition whitespace-nowrap border ${
                    activeCategory === cat 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition" size={20} />
                <input
                  type="text"
                  placeholder="Find your gear..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-sm transition"
                />
              </div>
              {isAdmin && (
                <button 
                  onClick={() => { setEditingProduct(null); setShowForm(true); }}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg shadow-green-600/30 transform transition hover:scale-110"
                  title="Add New Product"
                >
                  <Plus size={24} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-500 overflow-hidden border border-slate-100 group flex flex-col h-full">
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Nav+Bharat+Sports';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 text-xs px-3 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                    {product.category}
                  </span>
                  
                  {/* Sale/Tag Logic - Optional Visual */}
                  <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-md font-bold shadow-md transform -rotate-2">
                    HOT DEAL
                  </span>

                  {/* Admin Actions Overlay */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm">
                      <button 
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="p-3 bg-white text-slate-900 rounded-full hover:bg-orange-500 hover:text-white shadow-lg transform hover:scale-110 transition"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white shadow-lg transform hover:scale-110 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-orange-600 transition">{product.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description || 'Premium quality sports gear for professionals.'}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-slate-900 text-white p-3 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-slate-900/20 group-hover:shadow-orange-600/30"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="mx-auto w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <Search size={40} className="text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or category filter.</p>
                {isAdmin && (
                  <button 
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition"
                  >
                    Add Product
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      {!isAdmin && <ShieldsSection />}
      
      {!isAdmin && <Features />}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 border-t border-slate-800" id="contact">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <span className="text-white font-black text-2xl uppercase italic tracking-wider">Nav Bharat</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
              Empowering athletes in Jhansi since 2024. We are committed to providing world-class sports equipment to help you achieve your dreams.
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-orange-500 transition cursor-pointer"></div>
              <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-orange-500 transition cursor-pointer"></div>
              <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-orange-500 transition cursor-pointer"></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Shop</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-orange-500 transition flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Home</a></li>
              <li><a href="#shop" className="hover:text-orange-500 transition flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>All Products</a></li>
              <li><a href="#features" className="hover:text-orange-500 transition flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Why Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Visit Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-orange-500 mt-1 shrink-0" size={20} />
                <span className="text-slate-300">Chitra Chauraha,<br/>Near Tulsi Hotel,<br/>Jhansi, Uttar Pradesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-orange-500 shrink-0" size={20} />
                {/* Updated Phone Number */}
                <span className="text-slate-300">+91 79851 74679</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Nav Bharat Sports. Built with ❤️ for Sports Lovers.</p>
        </div>
      </footer>

      {/* Modal Form */}
      {showForm && (
        <ProductForm 
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} 
          editingProduct={editingProduct}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}