import React from 'react';
import finzoFlowLogo from '../../assets/FinzoFlow.png';
// import eliminado
import { DollarSign, FileText, Receipt, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { RecentInvoices } from './RecentInvoices';
import { ExpenseChart } from './ExpenseChart';
import { IncomeChart } from './IncomeChart';

export function Dashboard() {
  // Logo y nombre en la parte superior izquierda
  // Logo arriba del dashboard
  const { state, dispatch } = useApp();
  const { dashboardStats } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.user?.preferredCurrency || 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3">
          <img src={finzoFlowLogo} alt="FinzoFlow Logo" width={36} height={36} className="rounded-xl shadow" />
          <span className="text-2xl font-bold text-gray-800">Finzo<span className="text-teal-400">Flow</span></span>
          {state.user?.preferredCurrency && (
            <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold border border-blue-200">
              {state.user.preferredCurrency}
            </span>
          )}
        </div>
      </div>
      {/* Logo eliminado */}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(dashboardStats.totalIncome)}
          icon={DollarSign}
          change={dashboardStats.monthlyGrowth}
          changeType="positive"
          color="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(dashboardStats.totalExpenses)}
          icon={Receipt}
          change={-5.2}
          changeType="positive"
          color="red"
        />
        <StatCard
          title="Net Income"
          value={formatCurrency(dashboardStats.netIncome)}
          icon={TrendingUp}
          change={8.1}
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Pending Invoices"
          value={dashboardStats.pendingInvoices}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Overdue"
          value={dashboardStats.overDueInvoices}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Invoices"
          value={state.invoices.length}
          icon={FileText}
          color="gray"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Monthly Income" />
          {/* Sin datos */}
        </Card>
        
        <Card>
          <CardHeader title="Expense Categories" />
          <ExpenseChart />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader 
              title="Recent Invoices" 
              action={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'invoices' })}
                >
                  View All
                </Button>
              }
            />
            <RecentInvoices />
          </Card>
        </div>
        
        <Card>
          <CardHeader title="Quick Actions" />
          <div className="space-y-3">
            <Button 
              fullWidth 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'invoices' })}
            >
              Create Invoice
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'expenses' })}
            >
              Add Expense
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'clients' })}
            >
              Add Client
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Invoice paid by Acme Corp</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">New expense added</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Invoice sent to client</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}