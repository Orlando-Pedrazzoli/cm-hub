"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Key, Brain, Save, Trash2, Eye, EyeOff } from "lucide-react";

export function SettingsPanel() {
  const { settings, updateSettings, clearHistory, history } = useAppStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(settings.geminiApiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveApiKey = () => {
    updateSettings({ geminiApiKey: tempApiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Definições</h2>
        <p className="text-sm text-zinc-500">Configura o CM Policy Hub</p>
      </div>

      {/* Gemini API */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Gemini API</h3>
              <p className="text-xs text-zinc-500">Análise contextual com IA</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              label="API Key"
              type={showApiKey ? "text" : "password"}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="AIzaSy..."
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-9 text-zinc-500 hover:text-zinc-300"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Obtém a API Key em:{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Google AI Studio
            </a>{" "}
            (gratuito)
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveApiKey} size="sm">
              <Save className="w-4 h-4 mr-1" />
              {saved ? "Guardado!" : "Guardar"}
            </Button>
            {settings.geminiApiKey && (
              <span className="text-xs text-green-400">✓ API Key configurada</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Análise com IA</h3>
              <p className="text-xs text-zinc-500">Configurações de análise</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            enabled={settings.useAI}
            onChange={(enabled) => updateSettings({ useAI: enabled })}
            label="Usar Gemini AI"
            description="Análise contextual para casos ambíguos"
          />
          <Toggle
            enabled={settings.autoSaveHistory}
            onChange={(enabled) => updateSettings({ autoSaveHistory: enabled })}
            label="Guardar Histórico"
            description="Guardar análises automaticamente"
          />
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-medium">Gestão de Dados</h3>
              <p className="text-xs text-zinc-500">{history.length} análises guardadas</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="danger"
            size="sm"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Limpar Histórico
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}