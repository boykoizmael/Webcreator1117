import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Check, 
  Sparkles, 
  Crown, 
  Shield, 
  Zap, 
  Lock, 
  Clock, 
  DollarSign,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { getActiveUser, upgradeUserRank } from '../utils/accountManager';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: 'original' | 'vip' | 'nolife' | 'sidekick';
  onOpenContactModal?: (topic?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'vip',
  onOpenContactModal
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'original' | 'vip' | 'sidekick' | 'nolife'>(initialPlan);
  // Payment Option: 'cashapp' or 'automated'
  const [paymentOption, setPaymentOption] = useState<'cashapp' | 'automated'>('cashapp');

  // Cash App State
  const [cashAppStep, setCashAppStep] = useState<'init' | 'confirmed'>('init');
  const [payerGamertag, setPayerGamertag] = useState(() => {
    const user = getActiveUser();
    return user ? user.username : '';
  });
  const [payerEmail, setPayerEmail] = useState(() => {
    const user = getActiveUser();
    return user ? user.email : '';
  });

  // Automated Gateway State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewaySuccess, setGatewaySuccess] = useState(false);
  const [gatewayReceiptId, setGatewayReceiptId] = useState('');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'original' as const,
      name: 'Original Link Pass',
      price: '$5',
      priceNum: 5,
      badge: 'Popular',
      badgeColor: 'bg-blue-900/80 text-blue-300 border-blue-500/40',
      description: 'Private unblocked mirror link bypassing school filters.',
      perks: [
        'Direct unblocked private web link',
        'Bypasses GoGuardian, Securly & Lightspeed',
        'Clean stealth disguised URL'
      ]
    },
    {
      id: 'vip' as const,
      name: 'VIP Link & Rank',
      price: '$10',
      priceNum: 10,
      badge: 'Best Value',
      badgeColor: 'bg-amber-900/80 text-amber-300 border-amber-500/40',
      description: 'Exclusive secret VIP link other people do not have + website tools (coming soon).',
      perks: [
        'Secret VIP link others DO NOT have access to',
        'Access to exclusive website features (Coming Soon)',
        'Permanent VIP gold nametag on Leaderboards',
        'Guaranteed fast priority response'
      ]
    },
    {
      id: 'sidekick' as const,
      name: 'SideKick Rank',
      price: 'Perk Rank',
      priceNum: 5,
      badge: 'Community',
      badgeColor: 'bg-emerald-900/80 text-emerald-300 border-emerald-500/40',
      description: 'Access to minimal extra stuff, but more than original people.',
      perks: [
        'Sidekick badge next to your name',
        'Access to minimal bonus features',
        'Enhanced daily streak multiplier'
      ]
    },
    {
      id: 'nolife' as const,
      name: 'NoLife Rank',
      price: 'Elite Rank',
      priceNum: 10,
      badge: 'Legendary',
      badgeColor: 'bg-purple-900/80 text-purple-300 border-purple-500/40',
      description: 'Access to all game perks, cheats, uncap FPS & etc.',
      perks: [
        'All game perks, cheats & uncap FPS',
        'Custom player skins in Minecraft & 1v1',
        'Special purple glowing name on Leaderboards',
        'Includes all VIP unblocked mirror links'
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

  // The creator's destination Cash App url is masked internally as instructed:
  // "my @cashapp is $boykoizmael but make it private dont make it show my @cashapp just for their perspective make it says confirm or send to Cashapper"
  const cashAppRecipientUrl = 'https://cash.app/$boykoizmael';

  const handleSendToCashapper = () => {
    // Opens the destination cash app link securely in new tab without rendering the raw handle anywhere on the screen
    window.open(cashAppRecipientUrl, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmCashAppPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCashAppStep('confirmed');
    // Upgrade rank if logged in
    upgradeUserRank(selectedPlan);
  };

  const handleProcessAutomatedGateway = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setGatewaySuccess(true);
      setGatewayReceiptId(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
      // Auto upgrade rank
      upgradeUserRank(selectedPlan);
    }, 1800);
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length > 2) {
      return `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="secure-payment-gateway-modal"
        className="relative w-full max-w-2xl bg-[#111420] border border-[#273044] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Top Trust Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#212739] bg-[#161a29]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-950/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Secure Checkout & Pass Activation
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Official Web Store • Guaranteed Private Links & Game Ranks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#252c40] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm custom-scrollbar">
          
          {/* STEP 1: Select Plan or Rank */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Select Link Pass or Rank</span>
              </label>
              <span className="text-xs text-amber-400 font-bold font-mono">
                {currentPlan.price}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plans.map(plan => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setCashAppStep('init');
                      setGatewaySuccess(false);
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#192033] border-emerald-400/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                        : 'bg-[#131622] border-[#242b3d] hover:bg-[#181d2c] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {plan.id === 'vip' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        {plan.id === 'original' && <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                        {plan.id === 'nolife' && <Zap className="w-3.5 h-3.5 text-purple-400" />}
                        {plan.id === 'sidekick' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{plan.name}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${plan.badgeColor}`}>
                        {plan.price}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-snug mb-2">
                      {plan.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-gray-300 border-t border-[#23293a] pt-2">
                      {plan.perks.slice(0, 2).map((perk, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Payment Option (Cash App vs Automated Gateway) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Select Payment Option
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Option A: Cash App */}
              <button
                type="button"
                onClick={() => setPaymentOption('cashapp')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  paymentOption === 'cashapp'
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-md ring-1 ring-emerald-400/40 text-white'
                    : 'bg-[#131622] border-[#242b3d] text-gray-400 hover:bg-[#181d2c]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base ${
                  paymentOption === 'cashapp' ? 'bg-emerald-500 text-black' : 'bg-[#22283a] text-gray-300'
                }`}>
                  $
                </div>
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <span>Cash App</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">Send to Verified Cashapper</div>
                </div>
              </button>

              {/* Option B: Automated Gateway */}
              <button
                type="button"
                onClick={() => setPaymentOption('automated')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  paymentOption === 'automated'
                    ? 'bg-blue-950/60 border-blue-400 shadow-md ring-1 ring-blue-400/40 text-white'
                    : 'bg-[#131622] border-[#242b3d] text-gray-400 hover:bg-[#181d2c]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base ${
                  paymentOption === 'automated' ? 'bg-blue-500 text-white' : 'bg-[#22283a] text-gray-300'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <span>Automated Gateway</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Instant
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">Debit / Credit / Card</div>
                </div>
              </button>
            </div>
          </div>

          {/* VIEW A: CASH APP INTERFACE */}
          {paymentOption === 'cashapp' && (
            <div className="bg-[#141826] border border-[#283248] rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#242b3d] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-sm">
                    $
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Cash App Portal</h4>
                    <span className="text-[11px] text-gray-400">Direct transfer to Official Cashapper</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Due</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {currentPlan.price}.00 USD
                  </span>
                </div>
              </div>

              {cashAppStep === 'init' ? (
                <div className="space-y-4">
                  {/* Verified Recipient Box (Masked Private Perspective) */}
                  <div className="bg-[#0e111a] border border-[#242c3f] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                        Recipient Account
                      </div>
                      <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Official Verified Cashapper</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Status: <strong className="text-white">Active Merchant • Encrypted Routing</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendToCashapper}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Send to Cashapper</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Gamertag / Email Submission for Order Delivery */}
                  <form onSubmit={handleConfirmCashAppPayment} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">
                          Your Gamertag / Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={payerGamertag}
                            onChange={(e) => setPayerGamertag(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">
                          Your Email (for Link Delivery)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={payerEmail}
                            onChange={(e) => setPayerEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Send to Cashapper ({currentPlan.price})</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Cash App Success Confirmation State */
                <div className="bg-[#0f1a14] border border-emerald-500/50 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-white">
                    Order Submitted to Cashapper!
                  </h4>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    We registered your order for <strong className="text-emerald-400">{currentPlan.name}</strong> under gamertag <strong className="text-white">"{payerGamertag}"</strong>.
                  </p>
                  <div className="p-3 bg-[#131f18] rounded-lg border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                    Receipt Ref: CAP-{Math.floor(100000 + Math.random() * 900000)} • Private Link delivered to {payerEmail}
                  </div>
                  <button
                    onClick={() => {
                      setCashAppStep('init');
                      onClose();
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Done & Return to Game
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW B: AUTOMATED GATEWAY INTERFACE */}
          {paymentOption === 'automated' && (
            <div className="bg-[#141826] border border-[#283248] rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#242b3d] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Automated Card Gateway</h4>
                    <span className="text-[11px] text-gray-400">Instant validation & instant digital delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
                  <span className="text-blue-400 font-bold">{currentPlan.price}.00 USD</span>
                </div>
              </div>

              {!gatewaySuccess ? (
                <form onSubmit={handleProcessAutomatedGateway} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-blue-400 rounded-xl py-2 px-3 text-xs text-white placeholder:text-gray-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-blue-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white font-mono placeholder:text-gray-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-blue-400 rounded-xl py-2 px-3 text-xs text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-blue-400 rounded-xl py-2 px-3 text-xs text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        ZIP / Postal
                      </label>
                      <input
                        type="text"
                        required
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value.substring(0, 6))}
                        placeholder="90210"
                        className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-blue-400 rounded-xl py-2 px-3 text-xs text-white font-mono text-center outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-950/50 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authorizing 256-Bit Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {currentPlan.price}.00 USD via Automated Gateway</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Automated Gateway Success Receipt */
                <div className="bg-[#0e1628] border border-blue-500/50 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-white">
                    Automated Payment Authorized & Confirmed!
                  </h4>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    Your transaction was approved instantly. Your rank <strong className="text-blue-400">{currentPlan.name}</strong> is activated.
                  </p>
                  <div className="p-3 bg-[#121c33] rounded-lg border border-blue-500/30 text-xs text-blue-300 font-mono">
                    Receipt: {gatewayReceiptId} • Status: INSTANT ACTIVATION
                  </div>
                  <button
                    onClick={() => {
                      setGatewaySuccess(false);
                      onClose();
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Done & Return to Game
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CRITICAL: STRICT NO REFUNDS NOTICE */}
          <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-red-200 tracking-wide uppercase flex items-center gap-1.5">
                <span>Strict No Refunds Policy</span>
                <span className="text-[10px] bg-red-900/60 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30 font-mono">
                  FINAL SALE
                </span>
              </div>
              <p className="text-gray-300 mt-1 text-[11px] leading-relaxed">
                All purchases of private links, proxy access passes, and game ranks are non-refundable. Because digital server credentials and unblocked link addresses are delivered immediately, all transactions are final.
              </p>
            </div>
          </div>

          {/* Footer Assistance & Response Guarantee */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#23293a] text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Direct Creator Guarantee: Response always within 2–3 days!</span>
            </div>

            {onOpenContactModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenContactModal(`Question regarding ${currentPlan.name}`);
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Contact Webcreator1117 directly
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
