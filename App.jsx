import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Users, 
  LogOut, 
  ChevronDown, 
  Filter,
  Lock,
  Plus,
  RefreshCw,
  LogIn,
  AlertCircle
} from 'lucide-react';

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyDDHKlSSC3UcBWgiN-TPjo76Ah97ciK7Vw",
  authDomain: "sample-293b1.firebaseapp.com",
  projectId: "sample-293b1",
  storageBucket: "sample-293b1.firebasestorage.app",
  messagingSenderId: "814788555901",
  appId: "1:814788555901:web:60dd655faa09e4fc39ed14",
  measurementId: "G-STEH5KKY28"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Constants & Config ---
const FAMILIES = [
  "おせきファミリー",
  "けんすけファミリー",
  "スクラブファミリー",
  "みやぞんファミリー",
  "ちーたるファミリー",
  "ばなファミリー",
  "ぴーファミリー",
  "ぴょんファミリー",
  "まちゃぴファミリー",
  "みぃファミリー",
  "ゆつきファミリー",
  "甘ドリファミリー"
];

// ★★★ メンバー名簿 ★★★
const MEMBER_LIST = [
  // おせきファミリー
  { family: "おせきファミリー", name: "おせき" },
  { family: "おせきファミリー", name: "のん" },
  { family: "おせきファミリー", name: "ぴーじー" },
  { family: "おせきファミリー", name: "れんれん" },
  { family: "おせきファミリー", name: "夜露死苦" },
  { family: "おせきファミリー", name: "菅原瑛斗" },
  { family: "おせきファミリー", name: "まつこ" },
  { family: "おせきファミリー", name: "おとも" },
  { family: "おせきファミリー", name: "おまゆ" },
  { family: "おせきファミリー", name: "ねずみ先輩" },
  { family: "おせきファミリー", name: "そそ" },
  { family: "おせきファミリー", name: "あいか" },

  // けんすけファミリー
  { family: "けんすけファミリー", name: "健康なスケベ" },
  { family: "けんすけファミリー", name: "れいす" },
  { family: "けんすけファミリー", name: "フェンネル" },
  { family: "けんすけファミリー", name: "ひとかひめ" },
  { family: "けんすけファミリー", name: "やまと" },
  { family: "けんすけファミリー", name: "いもかれ" },
  { family: "けんすけファミリー", name: "そうり" },
  { family: "けんすけファミリー", name: "おかわり" },
  { family: "けんすけファミリー", name: "ゆきの" },
  { family: "けんすけファミリー", name: "なな氏" },
  { family: "けんすけファミリー", name: "こばなな" },
  { family: "けんすけファミリー", name: "かに" },

  // スクラブファミリー
  { family: "スクラブファミリー", name: "スクラブ" },
  { family: "スクラブファミリー", name: "わたけー" },
  { family: "スクラブファミリー", name: "かなん" },
  { family: "スクラブファミリー", name: "なむ" },
  { family: "スクラブファミリー", name: "きくまる。" },
  { family: "スクラブファミリー", name: "ほっさ" },
  { family: "スクラブファミリー", name: "あぼ" },
  { family: "スクラブファミリー", name: "ひめ" },
  { family: "スクラブファミリー", name: "あらいだひなの" },
  { family: "スクラブファミリー", name: "あさこ" },
  { family: "スクラブファミリー", name: "ちゃあ" },
  { family: "スクラブファミリー", name: "くり" },

  // みやぞんファミリー
  { family: "みやぞんファミリー", name: "みやぞん" },
  { family: "みやぞんファミリー", name: "ちょね" },
  { family: "みやぞんファミリー", name: "キャラキャラメルト" },
  { family: "みやぞんファミリー", name: "そうたろう" },
  { family: "みやぞんファミリー", name: "りょう" },
  { family: "みやぞんファミリー", name: "ボンバボン" },
  { family: "みやぞんファミリー", name: "ぺそ" },
  { family: "みやぞんファミリー", name: "ドリー！" },
  { family: "みやぞんファミリー", name: "ジェニファー" },
  { family: "みやぞんファミリー", name: "パトラッシュ" },
  { family: "みやぞんファミリー", name: "ちゃんもり" },
  { family: "みやぞんファミリー", name: "鈴木ひかり" },

  // ちーたるファミリー
  { family: "ちーたるファミリー", name: "ちーたる" },
  { family: "ちーたるファミリー", name: "八重" },
  { family: "ちーたるファミリー", name: "りょく" },
  { family: "ちーたるファミリー", name: "とーま" },
  { family: "ちーたるファミリー", name: "めい" },
  { family: "ちーたるファミリー", name: "どりー" },
  { family: "ちーたるファミリー", name: "ヤスキ" },
  { family: "ちーたるファミリー", name: "ましま" },
  { family: "ちーたるファミリー", name: "じょにー" },
  { family: "ちーたるファミリー", name: "まーや" },
  { family: "ちーたるファミリー", name: "ぜよ" },
  { family: "ちーたるファミリー", name: "せら" },

  // ばなファミリー
  { family: "ばなファミリー", name: "ばな" },
  { family: "ばなファミリー", name: "IC" },
  { family: "ばなファミリー", name: "きょうこ" },
  { family: "ばなファミリー", name: "こーしろー" },
  { family: "ばなファミリー", name: "公太郎" },
  { family: "ばなファミリー", name: "ティミー" },
  { family: "ばなファミリー", name: "ななとう" },
  { family: "ばなファミリー", name: "あんな" },
  { family: "ばなファミリー", name: "ねこ" },
  { family: "ばなファミリー", name: "ポメロン" },
  { family: "ばなファミリー", name: "なつ" },
  { family: "ばなファミリー", name: "シオン" },

  // ぴーファミリー
  { family: "ぴーファミリー", name: "ぴー" },
  { family: "ぴーファミリー", name: "おっくん" },
  { family: "ぴーファミリー", name: "そういち" },
  { family: "ぴーファミリー", name: "あべりな" },
  { family: "ぴーファミリー", name: "ながしー" },
  { family: "ぴーファミリー", name: "しゅんすけ" },
  { family: "ぴーファミリー", name: "もえきゅん" },
  { family: "ぴーファミリー", name: "かんな" },
  { family: "ぴーファミリー", name: "鈴木優花" },
  { family: "ぴーファミリー", name: "とぅーりお" },
  { family: "ぴーファミリー", name: "かごめ" },

  // ぴょんファミリー
  { family: "ぴょんファミリー", name: "ぴょん" },
  { family: "ぴょんファミリー", name: "サツカワ　レオ" },
  { family: "ぴょんファミリー", name: "さき" },
  { family: "ぴょんファミリー", name: "カマンベール・ビオ" },
  { family: "ぴょんファミリー", name: "橋本太郎" },
  { family: "ぴょんファミリー", name: "ももな" },
  { family: "ぴょんファミリー", name: "はまお" },
  { family: "ぴょんファミリー", name: "まりあ" },
  { family: "ぴょんファミリー", name: "さら" },
  { family: "ぴょんファミリー", name: "ひかり" },
  { family: "ぴょんファミリー", name: "なっち" },
  { family: "ぴょんファミリー", name: "れん" },

  // まちゃぴファミリー
  { family: "まちゃぴファミリー", name: "まちゃぴ" },
  { family: "まちゃぴファミリー", name: "ことー" },
  { family: "まちゃぴファミリー", name: "たかゆか" },
  { family: "まちゃぴファミリー", name: "超会議" },
  { family: "まちゃぴファミリー", name: "こーじ" },
  { family: "まちゃぴファミリー", name: "レイバックイナバウアー" },
  { family: "まちゃぴファミリー", name: "ふうちゃん" },
  { family: "まちゃぴファミリー", name: "りな" },
  { family: "まちゃぴファミリー", name: "るな" },
  { family: "まちゃぴファミリー", name: "わか" },
  { family: "まちゃぴファミリー", name: "とみー" },

  // みぃファミリー
  { family: "みぃファミリー", name: "みぃ" },
  { family: "みぃファミリー", name: "ぺちか" },
  { family: "みぃファミリー", name: "たいしょー" },
  { family: "みぃファミリー", name: "いちを" },
  { family: "みぃファミリー", name: "たかてぃん" },
  { family: "みぃファミリー", name: "あすみん" },
  { family: "みぃファミリー", name: "しまめい" },
  { family: "みぃファミリー", name: "むらさき" },
  { family: "みぃファミリー", name: "しまこ" },
  { family: "みぃファミリー", name: "こんのほのか" },
  { family: "みぃファミリー", name: "あずみ" },
  { family: "みぃファミリー", name: "いもたる" },

  // ゆつきファミリー
  { family: "ゆつきファミリー", name: "ゆつき" },
  { family: "ゆつきファミリー", name: "ちゅーきち" },
  { family: "ゆつきファミリー", name: "びっくりドンキー" },
  { family: "ゆつきファミリー", name: "佐藤悠貴" },
  { family: "ゆつきファミリー", name: "ゆきち" },
  { family: "ゆつきファミリー", name: "バンクシー" },
  { family: "ゆつきファミリー", name: "ちゃくみ" },
  { family: "ゆつきファミリー", name: "ふなはら" },
  { family: "ゆつきファミリー", name: "ほっしー" },
  { family: "ゆつきファミリー", name: "ぽこ" },
  { family: "ゆつきファミリー", name: "4649" },
  { family: "ゆつきファミリー", name: "らび" },

  // 甘ドリファミリー
  { family: "甘ドリファミリー", name: "甘どり" },
  { family: "甘ドリファミリー", name: "スナ" },
  { family: "甘ドリファミリー", name: "少年" },
  { family: "甘ドリファミリー", name: "みやたか" },
  { family: "甘ドリファミリー", name: "さくら" },
  { family: "甘ドリファミリー", name: "アミーゴ" },
  { family: "甘ドリファミリー", name: "マロ" },
  { family: "甘ドリファミリー", name: "いなげひかりこ" },
  { family: "甘ドリファミリー", name: "りーしゃん" },
  { family: "甘ドリファミリー", name: "田中真菜実" },
  { family: "甘ドリファミリー", name: "ゆり" },
  { family: "甘ドリファミリー", name: "みどり" },
];

const STATUS_OPTIONS = {
  present: { label: '出席', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle2 },
  absent: { label: '欠席', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  late: { label: '遅刻/早退', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: HelpCircle },
  undecided: { label: '未定', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: HelpCircle },
};

const ADMIN_PASSWORD = "yosakoi"; 

// 初期データ用モック
const INITIAL_EVENTS = [
  { id: 'evt-001', title: '全体練習 第1部', date: '2024-05-18', time: '13:00-15:00', location: '〇〇体育館 メイン' },
  { id: 'evt-002', title: '全体練習 第2部', date: '2024-05-18', time: '15:30-17:30', location: '〇〇体育館 メイン' },
];

const MOCK_FETCHED_EVENTS = [
  { id: 'g-001', title: '平日夜練習', date: '2024-05-22', time: '19:00-21:00', location: '△△コミュニティセンター' },
  { id: 'g-002', title: '衣装説明会＆練習', date: '2024-05-25', time: '13:00-17:00', location: '□□ホール' },
  { id: 'g-003', title: '強化練習 (選抜)', date: '2024-05-26', time: '09:00-12:00', location: '〇〇体育館 サブ' },
  { id: 'g-004', title: '全体練習', date: '2024-06-01', time: '13:00-17:00', location: '未定' },
  { id: 'g-005', title: '遠征リハーサル', date: '2024-06-08', time: '10:00-16:00', location: '市民体育館' },
];

// --- Helper Functions ---
const getDayInfo = (dateString) => {
  if (!dateString) return { dayStr: '', colorClass: 'bg-gray-100 text-gray-600' };
  
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayIndex = date.getDay(); 
  const days = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
  const dayStr = days[dayIndex];

  let colorClass = 'bg-gray-100 text-gray-600'; 
  if (dayIndex === 0) colorClass = 'bg-green-100 text-green-700 border-green-200'; // Sun: Green
  if (dayIndex === 3) colorClass = 'bg-cyan-100 text-cyan-700 border-cyan-200';   // Wed: Light Blue
  if (dayIndex === 6) colorClass = 'bg-pink-100 text-pink-700 border-pink-200';   // Sat: Pink

  return { dayStr, colorClass };
};

// LocalStorage Key
const LS_USER_ID_KEY = `yosakoi_app_user_id_${appId}`;

// --- Components ---

// 1. Auth Screen (List Selection Only)
const AuthScreen = ({ onLogin }) => {
  const [family, setFamily] = useState(FAMILIES[0]);
  const [selectedName, setSelectedName] = useState('');

  // Filter members from constant list
  const familyMembers = useMemo(() => {
    return MEMBER_LIST
      .filter(m => m.family === family)
      .sort((a, b) => {
         // 元のリスト順（=ファミリーの並び順）を維持したい場合はsortを外す
         // ここでは見つけやすいように50音順ソートを入れていますが、
         // リーダーを先頭にしたい場合はソートを外してください。
         // 今回はリーダーが先頭にいるようなので、ソートなし（リスト順）に変更します。
         return 0; 
      });
  }, [family]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedName) {
      onLogin(family, selectedName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 safe-area-top safe-area-bottom">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-indigo-50">
        <div className="text-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">よさこい出欠</h1>
          <p className="text-xs text-gray-400 mt-1">メンバー選択ログイン</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start text-xs text-blue-700 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>あなたの所属ファミリーと名前を選んで「ログイン」を押してください。</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">所属ファミリー</label>
            <div className="relative">
              <select
                value={family}
                onChange={(e) => {
                  setFamily(e.target.value);
                  setSelectedName('');
                }}
                className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700"
              >
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">名前を選択</label>
            <div className="relative">
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                disabled={familyMembers.length === 0}
                className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 disabled:opacity-50"
              >
                <option value="">あなたの名前を選択</option>
                {familyMembers.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {familyMembers.length === 0 && (
               <p className="text-[10px] text-red-400 mt-1">※名簿データがありません。管理者に連絡してください。</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedName}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-indigo-200"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. Admin Panel
const AdminPanel = ({ currentEvents, onAddEvents }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("パスワードが違います");
    }
  };

  const fetchCalendarEvents = () => {
    setIsFetching(true);
    setTimeout(() => {
      const currentIds = new Set(currentEvents.map(e => e.id));
      const newCandidates = MOCK_FETCHED_EVENTS.filter(e => !currentIds.has(e.id));
      setFetchedEvents(newCandidates);
      const newIds = new Set(newCandidates.map(e => e.id));
      setSelectedEventIds(newIds);
      setIsFetching(false);
    }, 800);
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selectedEventIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEventIds(newSet);
  };

  const handleImport = () => {
    const eventsToAdd = fetchedEvents.filter(e => selectedEventIds.has(e.id));
    if (eventsToAdd.length === 0) return;
    onAddEvents(eventsToAdd);
    setFetchedEvents([]);
    setSelectedEventIds(new Set());
    alert(`${eventsToAdd.length}件の予定を追加しました`);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
          <div className="bg-gray-100 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">管理者認証</h2>
          <form onSubmit={handleLogin} className="mt-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="パスワード"
            />
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all">
              認証する
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              カレンダー取込
            </h2>
            <p className="text-xs text-gray-500 mt-1">Googleカレンダーから予定を取得します</p>
          </div>
          <button 
            onClick={fetchCalendarEvents}
            disabled={isFetching}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-100 font-bold text-sm transition disabled:opacity-50 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? '取得中...' : '予定を取得'}
          </button>
        </div>

        {fetchedEvents.length > 0 ? (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 flex justify-between">
                <span>候補一覧</span>
                <span>{selectedEventIds.size}件選択</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {fetchedEvents.map(event => {
                  const { dayStr, colorClass } = getDayInfo(event.date);
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50 flex items-start gap-3 transition active:bg-gray-100" onClick={() => toggleSelect(event.id)}>
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEventIds.has(event.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {selectedEventIds.has(event.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${colorClass} font-bold`}>{event.date} {dayStr}</span>
                          <span className="font-bold text-gray-800 text-sm">{event.time}</span>
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{event.location}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button 
              onClick={handleImport}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" />
              選択した予定を追加
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm">
            {isFetching ? 'カレンダーを確認中...' : '新しい予定を取り込んでください'}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">公開中の日程</h3>
        <div className="space-y-2">
          {currentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">予定はまだありません</p>
          ) : (
            currentEvents.map(event => {
              const { dayStr, colorClass } = getDayInfo(event.date);
              return (
                <div key={event.id} className="p-3 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-gray-50/50 gap-2">
                  <div>
                    <span className={`inline-block mr-2 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${colorClass}`}>
                      {event.date} {dayStr}
                    </span>
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{event.title}</span>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap self-start sm:self-center">公開中</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Status Badge
const StatusBadge = ({ status }) => {
  const config = STATUS_OPTIONS[status] || STATUS_OPTIONS.undecided;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${config.color} whitespace-nowrap`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// 4. Main Dashboard
const Dashboard = ({ user, events, allData, onUpdateStatus, onLogout, onAddEvents }) => {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('ALL');

  const filteredUsers = useMemo(() => {
    let users = Object.values(allData);
    // MEMBER_LISTにあってallDataにまだない（一度もログインしていない）人も表示した方が良いか？
    // → 「全体一覧」では、アクティブな（一度でもログインした）メンバーだけ表示する仕様にします。
    // もし「未ログインの人も全員×で表示したい」場合は、MEMBER_LISTをベースにallDataをマージする必要があります。
    // 今回は「入力済みメンバーの可視化」を優先し、MEMBER_LISTベースで表示します。
    
    // Create a map of existing data
    const dataMap = allData;
    
    // Merge MEMBER_LIST with Firestore data
    const mergedList = MEMBER_LIST.map(member => {
      const docId = `${member.family}_${member.name}`;
      return {
        uid: docId,
        ...member,
        ...(dataMap[docId] || {}) // Overwrite with Firestore data if exists
      };
    });

    let result = mergedList;
    if (selectedFamilyFilter !== 'ALL') {
      result = result.filter(u => u.family === selectedFamilyFilter);
    }
    return result; 
    // ソートを削除（リストの順序を維持）
    // return result.sort((a, b) => { ... });
  }, [allData, selectedFamilyFilter]);

  const getEventCounts = (eventId) => {
    let counts = { present: 0, absent: 0, late: 0, undecided: 0 };
    // MEMBER_LISTベースでカウント
    MEMBER_LIST.forEach(member => {
      const docId = `${member.family}_${member.name}`;
      const status = allData[docId]?.responses?.[eventId] || 'undecided';
      counts[status]++;
    });
    return counts;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Responsive Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm safe-area-top">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-gray-800 text-base md:text-lg truncate">よさこい出欠</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-gray-500">{user.family}</div>
              <div className="text-xs font-bold text-gray-800">{user.name}</div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              title="ログアウト"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">ログアウト</span>
            </button>
          </div>
        </div>
        
        {/* Responsive Tab Switcher */}
        <div className="flex border-t border-gray-100 bg-white">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'input' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            マイ出欠
            {activeTab === 'input' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full mb-1 sm:hidden"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'list' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            全体一覧
            {activeTab === 'list' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full mb-1 sm:hidden"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'admin' ? 'text-gray-800 border-gray-800 bg-gray-50' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            管理者
            {activeTab === 'admin' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-800 rounded-full mb-1 sm:hidden"></span>}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 flex-1 pb-20 safe-area-bottom">
        
        {/* --- VIEW 1: INPUT MODE --- */}
        {activeTab === 'input' && (
          <div className="space-y-4">
            {events.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl text-gray-400 text-sm border border-dashed border-gray-200">
                現在登録されている練習予定はありません
              </div>
            )}
            
            {events.map(event => {
              const myStatus = allData[user.uid]?.responses?.[event.id] || 'undecided';
              const { dayStr, colorClass } = getDayInfo(event.date);
              
              return (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`${colorClass} text-xs font-bold px-2.5 py-1 rounded-md tracking-wide border`}>
                        {event.date} {dayStr}
                      </span>
                      <StatusBadge status={myStatus} />
                    </div>
                    {/* Consistent font size for mobile readability */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-gray-800 leading-tight">{event.title}</h3>
                      <div className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="opacity-70 text-xs tracking-wider">時間:</span>
                        {event.time}
                      </div>
                      <div className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="opacity-70 text-xs tracking-wider">場所:</span>
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* Large touch targets for mobile */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'present')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-indigo-700 active:text-white ${
                        myStatus === 'present' ? 'bg-indigo-600 text-white shadow-inner' : 'text-gray-500 hover:bg-indigo-50'
                      }`}
                    >
                      <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'present' ? 'opacity-100' : 'opacity-40'}`} />
                      出席
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'late')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-yellow-600 active:text-white ${
                        myStatus === 'late' ? 'bg-yellow-500 text-white shadow-inner' : 'text-gray-500 hover:bg-yellow-50'
                      }`}
                    >
                      <HelpCircle className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'late' ? 'opacity-100' : 'opacity-40'}`} />
                      遅刻/早退
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'absent')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-red-600 active:text-white ${
                        myStatus === 'absent' ? 'bg-red-500 text-white shadow-inner' : 'text-gray-500 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'absent' ? 'opacity-100' : 'opacity-40'}`} />
                      欠席
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- VIEW 2: LIST MODE --- */}
        {activeTab === 'list' && (
          <div className="space-y-5">
            {/* Horizontal Scrolling Filter */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
                <button
                  onClick={() => setSelectedFamilyFilter('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    selectedFamilyFilter === 'ALL' 
                      ? 'bg-gray-800 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  全員
                </button>
                {FAMILIES.map(fam => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamilyFilter(fam)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 ${
                      selectedFamilyFilter === fam 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {fam.replace('ファミリー', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Summary Cards */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
              <div className="flex gap-3 w-max">
                {events.map(event => {
                  const counts = getEventCounts(event.id);
                  const { dayStr, colorClass } = getDayInfo(event.date);
                  return (
                    <div key={event.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-44 shrink-0">
                      <div className={`text-[10px] mb-1 font-bold inline-block px-1.5 py-0.5 rounded ${colorClass}`}>
                        {event.date.slice(5)} {dayStr} {event.time.split('-')[0]}~
                      </div>
                      <div className="text-xs font-bold text-gray-800 truncate mb-2 mt-1">{event.title}</div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-green-600">○ {counts.present}</span>
                        <span className="text-yellow-600">△ {counts.late}</span>
                        <span className="text-red-500">× {counts.absent}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sticky Column Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 sticky left-0 bg-gray-50 z-10 w-32 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-xs">
                        名前 ({filteredUsers.length})
                      </th>
                      {events.map(event => {
                        const { dayStr } = getDayInfo(event.date);
                        return (
                          <th key={event.id} className="px-1 py-2 min-w-[70px] text-center font-normal border-l border-gray-100">
                            <div className="text-[10px] text-gray-400 leading-none mb-1">{event.date.slice(5)}{dayStr}</div>
                            <div className="truncate w-[70px] mx-auto text-[10px] leading-tight">{event.title}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-gray-100">
                          <div className="font-bold text-gray-800 text-xs sm:text-sm truncate w-28">{u.name}</div>
                          <div className="text-[10px] text-gray-400 truncate w-28">{u.family.replace('ファミリー', '')}</div>
                        </td>
                        {events.map(event => {
                          const status = u.responses?.[event.id] || 'undecided';
                          let symbol = '－';
                          let colorClass = 'text-gray-300';
                          
                          if (status === 'present') { symbol = '○'; colorClass = 'text-green-600 font-bold bg-green-50/30'; }
                          if (status === 'absent') { symbol = '×'; colorClass = 'text-red-400 bg-red-50/30'; }
                          if (status === 'late') { symbol = '△'; colorClass = 'text-yellow-500 font-bold bg-yellow-50/30'; }

                          return (
                            <td key={`${u.uid}-${event.id}`} className={`px-1 py-2 text-center border-l border-gray-100 ${colorClass}`}>
                              {symbol}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={events.length + 1} className="px-4 py-12 text-center text-gray-400 text-xs">
                          表示するメンバーがいません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 3: ADMIN MODE --- */}
        {activeTab === 'admin' && (
          <AdminPanel currentEvents={events} onAddEvents={onAddEvents} />
        )}
      </main>
    </div>
  );
};

// 5. Main App Container
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({});
  const [events, setEvents] = useState([]);

  // Auth & Initial Data Load
  useEffect(() => {
    const savedUserId = localStorage.getItem(LS_USER_ID_KEY);
    
    const initApp = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initApp();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 2. Fetch Events
        const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
        const unsubscribeEvents = onSnapshot(eventsRef, (docSnap) => {
          if (docSnap.exists()) {
            const items = docSnap.data().items || [];
            items.sort((a, b) => new Date(`${a.date} ${a.time.split('-')[0]}`) - new Date(`${b.date} ${b.time.split('-')[0]}`));
            setEvents(items);
          } else {
            setDoc(eventsRef, { items: INITIAL_EVENTS });
            setEvents(INITIAL_EVENTS);
          }
        });

        // 3. Fetch All Users Data
        const dataRef = collection(db, 'artifacts', appId, 'public', 'data', 'attendance');
        const unsubscribeData = onSnapshot(dataRef, (snapshot) => {
          const data = {};
          snapshot.forEach(doc => {
            data[doc.id] = { uid: doc.id, ...doc.data() };
          });
          setAllData(data);
          
          if (!user && savedUserId) {
            // Restore user if exists in DB, or construct if simple login (MEMBER_LIST based)
            // But we need responses from DB.
            if (data[savedUserId]) {
              setUser({ uid: savedUserId, ...data[savedUserId] });
            } else {
              // Handle case where localstorage has ID but DB doesn't (maybe first load after code update)
              // We'll let handleLogin fix this or user will re-login.
            }
          }
          setLoading(false);
        });
        
        return () => {
          unsubscribeEvents();
          unsubscribeData();
        };
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []); 

  // Direct login from MEMBER_LIST
  const handleLogin = async (family, name) => {
    // Generate deterministic ID
    const userId = `${family}_${name}`;
    
    try {
      // Check if user exists in DB, if not create
      let userData = allData[userId];
      
      if (!userData) {
         userData = {
          name,
          family,
          responses: {},
          updatedAt: serverTimestamp(),
        };
        // Save to DB
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'attendance', userId), userData);
      }
      
      // Local Login
      localStorage.setItem(LS_USER_ID_KEY, userId);
      setUser({ uid: userId, ...userData });

    } catch (e) {
      console.error("Error:", e);
      alert("ログインに失敗しました");
    }
  };

  const handleUpdateStatus = async (eventId, status) => {
    if (!user) return;
    const newResponses = { ...user.responses, [eventId]: status };
    setUser({ ...user, responses: newResponses }); 
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'attendance', user.uid), {
        responses: newResponses,
        updatedAt: serverTimestamp()
      });
    } catch (e) { console.error(e); }
  };

  const handleAddEvents = async (newEvents) => {
    try {
      const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
      await updateDoc(eventsRef, { items: arrayUnion(...newEvents) });
    } catch (e) {
      console.error(e);
      alert("失敗しました");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_USER_ID_KEY);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={user} 
      events={events} 
      allData={allData} 
      onUpdateStatus={handleUpdateStatus} 
      onLogout={handleLogout}
      onAddEvents={handleAddEvents}
    />
  );
}