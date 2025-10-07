'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  Plus, 
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  Search,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Calculator,
  ArrowUpDown,
  Target,
  Activity,
  Download,
  Upload,
  Settings,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Building,
  CreditCard,
  Wallet
} from 'lucide-react';
import { 
  Currency, 
  ExchangeRate, 
  CurrencyStatus 
} from '@/lib/models/finance';

// Mock data
const mockCurrencies: Currency[] = [
  {
    id: '1',
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: '£',
    decimalPlaces: 2,
    isBaseCurrency: true,
    isActive: true,
    status: CurrencyStatus.ACTIVE,
    lastExchangeRate: 1.0000,
    lastExchangeRateDate: new Date(),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
    status: CurrencyStatus.ACTIVE,
    lastExchangeRate: 49.25,
    lastExchangeRateDate: new Date(),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
    status: CurrencyStatus.ACTIVE,
    lastExchangeRate: 53.85,
    lastExchangeRateDate: new Date(),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
    status: CurrencyStatus.ACTIVE,
    lastExchangeRate: 62.40,
    lastExchangeRateDate: new Date(),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
    status: CurrencyStatus.ACTIVE,
    lastExchangeRate: 13.41,
    lastExchangeRateDate: new Date(),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: false,
    status: CurrencyStatus.INACTIVE,
    lastExchangeRate: 13.12,
    lastExchangeRateDate: new Date('2024-03-15'),
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockExchangeRates: ExchangeRate[] = [
  {
    id: '1',
    fromCurrencyCode: 'EGP',
    toCurrencyCode: 'USD',
    rate: 0.0203,
    inverseRate: 49.25,
    rateDate: new Date(),
    isActive: true,
    source: 'Central Bank',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '2',
    fromCurrencyCode: 'EGP',
    toCurrencyCode: 'EUR',
    rate: 0.0186,
    inverseRate: 53.85,
    rateDate: new Date(),
    isActive: true,
    source: 'Central Bank',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '3',
    fromCurrencyCode: 'EGP',
    toCurrencyCode: 'GBP',
    rate: 0.0160,
    inverseRate: 62.40,
    rateDate: new Date(),
    isActive: true,
    source: 'Central Bank',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '4',
    fromCurrencyCode: 'USD',
    toCurrencyCode: 'EUR',
    rate: 0.9180,
    inverseRate: 1.0893,
    rateDate: new Date(),
    isActive: true,
    source: 'Central Bank',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    updatedBy: 'system'
  }
];

export function MultiCurrency() {
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(mockExchangeRates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [isAddCurrencyDialogOpen, setIsAddCurrencyDialogOpen] = useState(false);
  const [isEditCurrencyDialogOpen, setIsEditCurrencyDialogOpen] = useState(false);
  const [isViewCurrencyDialogOpen, setIsViewCurrencyDialogOpen] = useState(false);
  const [isAddRateDialogOpen, setIsAddRateDialogOpen] = useState(false);
  const [isEditRateDialogOpen, setIsEditRateDialogOpen] = useState(false);
  const [isViewRateDialogOpen, setIsViewRateDialogOpen] = useState(false);
  const [isRevaluationDialogOpen, setIsRevaluationDialogOpen] = useState(false);
  const [conversionAmount, setConversionAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EGP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Auto-refresh exchange rates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate rate updates
      setExchangeRates(prevRates => 
        prevRates.map(rate => ({
          ...rate,
          rate: rate.rate * (1 + (Math.random() - 0.5) * 0.001), // ±0.05% change
          inverseRate: 1 / (rate.rate * (1 + (Math.random() - 0.5) * 0.001)),
          rateDate: new Date()
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Currency conversion calculation
  useEffect(() => {
    if (conversionAmount && fromCurrency && toCurrency) {
      const amount = parseFloat(conversionAmount);
      if (!isNaN(amount)) {
        let rate = 1;
        
        if (fromCurrency === toCurrency) {
          rate = 1;
        } else {
          const exchangeRate = exchangeRates.find(rate => 
            rate.fromCurrencyCode === fromCurrency && rate.toCurrencyCode === toCurrency
          );
          
          if (exchangeRate) {
            rate = exchangeRate.rate;
          } else {
            // Try reverse rate
            const reverseRate = exchangeRates.find(rate => 
              rate.fromCurrencyCode === toCurrency && rate.toCurrencyCode === fromCurrency
            );
            if (reverseRate) {
              rate = reverseRate.inverseRate;
            }
          }
        }
        
        setConvertedAmount(amount * rate);
      }
    }
  }, [conversionAmount, fromCurrency, toCurrency, exchangeRates]);

  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = 
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || currency.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CurrencyStatus) => {
    const configs = {
      [CurrencyStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Active' },
      [CurrencyStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Inactive' },
      [CurrencyStatus.SUSPENDED]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Suspended' }
    };

    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getRateChangeIndicator = (rate: ExchangeRate) => {
    // Simulate rate change for demo
    const change = (Math.random() - 0.5) * 0.02; // ±1% change
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change * 100).toFixed(2)}%
      </div>
    );
  };

  const baseCurrency = currencies.find(c => c.isBaseCurrency);
  const activeCurrencies = currencies.filter(c => c.status === CurrencyStatus.ACTIVE);
  const totalActiveCurrencies = activeCurrencies.length;
  const ratesUpdatedToday = exchangeRates.filter(rate => {
    const today = new Date();
    const rateDate = new Date(rate.rateDate);
    return rateDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Currency & Exchange Rates</h2>
          <p className="text-muted-foreground">Manage currencies, exchange rates, and conversions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Rates
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Rates
          </Button>
          <Button onClick={() => setIsAddCurrencyDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Currency</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseCurrency?.code}</div>
            <p className="text-xs text-muted-foreground">
              {baseCurrency?.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Currencies</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveCurrencies}</div>
            <p className="text-xs text-muted-foreground">
              Supported currencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchange Rates</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exchangeRates.length}</div>
            <p className="text-xs text-muted-foreground">
              Active rate pairs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updated Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratesUpdatedToday}</div>
            <p className="text-xs text-muted-foreground">
              Rate updates
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="currencies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="exchange-rates">Exchange Rates</TabsTrigger>
          <TabsTrigger value="converter">Currency Converter</TabsTrigger>
          <TabsTrigger value="revaluation">Revaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="currencies" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by currency code or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value={CurrencyStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={CurrencyStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={CurrencyStatus.SUSPENDED}>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Currencies Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Currency</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Symbol</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Decimal Places</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Base Currency</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Last Rate</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCurrencies.map((currency) => (
                        <tr key={currency.id} className="border-b">
                          <td className="p-4">
                            <div className="font-medium">{currency.code}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{currency.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">{currency.symbol}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{currency.decimalPlaces}</div>
                          </td>
                          <td className="p-4">
                            {currency.isBaseCurrency ? (
                              <Badge className="bg-blue-100 text-blue-800">Base</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(currency.status)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {currency.isBaseCurrency ? '1.0000' : currency.lastExchangeRate.toFixed(4)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {currency.lastExchangeRateDate.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsViewCurrencyDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsEditCurrencyDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange-rates" className="space-y-6">
          {/* Exchange Rates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Exchange Rates</CardTitle>
                <Button onClick={() => setIsAddRateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchangeRates.map((rate) => (
                  <div key={rate.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold">
                          {rate.fromCurrencyCode}/{rate.toCurrencyCode}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rate.source}
                        </div>
                        <div className="text-sm">
                          {rate.rateDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {rate.rate.toFixed(6)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Inverse: {rate.inverseRate.toFixed(4)}
                          </div>
                        </div>
                        {getRateChangeIndicator(rate)}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRate(rate);
                              setIsViewRateDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRate(rate);
                              setIsEditRateDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converter" className="space-y-6">
          {/* Currency Converter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Currency Converter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={conversionAmount}
                      onChange={(e) => setConversionAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromCurrency">From</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activeCurrencies.map((currency) => (
                            <SelectItem key={currency.id} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="toCurrency">To</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activeCurrencies.map((currency) => (
                            <SelectItem key={currency.id} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Converted Amount</div>
                    <div className="text-2xl font-bold">
                      {convertedAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {toCurrency}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCurrencies.slice(0, 5).map((currency) => {
                    if (currency.code === baseCurrency?.code) return null;
                    
                    const rate = exchangeRates.find(r => 
                      r.fromCurrencyCode === baseCurrency?.code && r.toCurrencyCode === currency.code
                    );
                    
                    return (
                      <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-sm text-muted-foreground">{currency.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {rate ? rate.rate.toFixed(4) : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {baseCurrency?.code}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revaluation" className="space-y-6">
          {/* Currency Revaluation */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Revaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">EGP 2,385,000</div>
                    <div className="text-sm text-muted-foreground">Total Exposure</div>
                    <div className="text-xs text-muted-foreground mt-1">All currencies</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+EGP 12,500</div>
                    <div className="text-sm text-muted-foreground">Gain/Loss</div>
                    <div className="text-xs text-green-600 mt-1">Since last revaluation</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-sm text-muted-foreground">Currencies</div>
                    <div className="text-xs text-muted-foreground mt-1">Requiring revaluation</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Revaluation Summary</h4>
                  <div className="space-y-2">
                    {activeCurrencies.filter(c => !c.isBaseCurrency).map((currency) => {
                      const rate = exchangeRates.find(r => 
                        r.fromCurrencyCode === baseCurrency?.code && r.toCurrencyCode === currency.code
                      );
                      const mockExposure = Math.random() * 100000;
                      const mockPreviousRate = rate ? rate.rate * (1 + (Math.random() - 0.5) * 0.1) : 1;
                      const gainLoss = mockExposure * (rate ? rate.rate - mockPreviousRate : 0);
                      
                      return (
                        <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-medium">{currency.code}</div>
                            <div className="text-sm text-muted-foreground">
                              Exposure: {currency.symbol} {mockExposure.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {gainLoss >= 0 ? '+' : ''}{baseCurrency?.symbol} {gainLoss.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Rate: {rate ? rate.rate.toFixed(4) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setIsRevaluationDialogOpen(true)}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Revaluation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Currency Dialog */}
      <Dialog open={isAddCurrencyDialogOpen} onOpenChange={setIsAddCurrencyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Currency</DialogTitle>
            <DialogDescription>
              Add a new currency to your system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currencyCode">Currency Code</Label>
                <Input id="currencyCode" placeholder="USD" maxLength={3} />
              </div>
              <div>
                <Label htmlFor="currencyName">Currency Name</Label>
                <Input id="currencyName" placeholder="US Dollar" />
              </div>
              <div>
                <Label htmlFor="currencySymbol">Symbol</Label>
                <Input id="currencySymbol" placeholder="$" />
              </div>
              <div>
                <Label htmlFor="decimalPlaces">Decimal Places</Label>
                <Input id="decimalPlaces" type="number" placeholder="2" />
              </div>
              <div>
                <Label htmlFor="isBaseCurrency">Base Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Active" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CurrencyStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={CurrencyStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={CurrencyStatus.SUSPENDED}>Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCurrencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddCurrencyDialogOpen(false)}>
              Add Currency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Currency Dialog */}
      <Dialog open={isViewCurrencyDialogOpen} onOpenChange={setIsViewCurrencyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Currency Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedCurrency?.code}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCurrency && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency Code</Label>
                  <div className="text-sm font-medium">{selectedCurrency.code}</div>
                </div>
                <div>
                  <Label>Currency Name</Label>
                  <div className="text-sm font-medium">{selectedCurrency.name}</div>
                </div>
                <div>
                  <Label>Symbol</Label>
                  <div className="text-sm font-medium">{selectedCurrency.symbol}</div>
                </div>
                <div>
                  <Label>Decimal Places</Label>
                  <div className="text-sm font-medium">{selectedCurrency.decimalPlaces}</div>
                </div>
                <div>
                  <Label>Base Currency</Label>
                  <div>
                    {selectedCurrency.isBaseCurrency ? (
                      <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedCurrency.status)}</div>
                </div>
                <div>
                  <Label>Last Exchange Rate</Label>
                  <div className="text-sm font-medium">
                    {selectedCurrency.isBaseCurrency ? '1.0000' : selectedCurrency.lastExchangeRate.toFixed(4)}
                  </div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">
                    {selectedCurrency.lastExchangeRateDate.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewCurrencyDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewCurrencyDialogOpen(false);
              setIsEditCurrencyDialogOpen(true);
            }}>
              Edit Currency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}