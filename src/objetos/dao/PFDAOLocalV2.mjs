import PF from "../pessoas/PF.mjs";

export default class PFDAO {
  constructor() {
    this.chave = "pessoasFisicas";
  }

  // 🔹 Retorna lista atual
  listar() {
    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error("Erro ao ler PF:", e);
      return [];
    }
  }

  // 🔹 Converte a classe PF para objeto simples
  toPlain(pf) {
    if (!pf) return {};
    const end = pf.getEndereco?.();
    const titulo = pf.getTitulo?.();
    const telefones = pf.getTelefones?.() || [];

    return {
      nome: pf.getNome?.(),
      email: pf.getEmail?.(),
      cpf: pf.getCPF?.(),
      endereco: end
        ? {
            cep: end.getCep?.(),
            logradouro: end.getLogradouro?.(),
            bairro: end.getBairro?.(),
            cidade: end.getCidade?.(),
            uf: end.getUf?.(),
            regiao: end.getRegiao?.(),
          }
        : {},
      telefones: telefones.map((t) => ({
        ddd: t.getDdd?.(),
        numero: t.getNumero?.(),
      })),
      titulo: titulo
        ? {
            numero: titulo.getNumero?.(),
            zona: titulo.getZona?.(),
            secao: titulo.getSecao?.(),
          }
        : {},
    };
  }

  // 🔹 Salvar novo registro
  salvar(pf) {
    const lista = this.listar();
    const obj = this.toPlain(pf);

    if (!obj.cpf) {
      console.error("❌ CPF não informado, não é possível salvar PF");
      return;
    }

    lista.push(obj);
    localStorage.setItem(this.chave, JSON.stringify(lista));
    console.info("✅ PF salva:", obj);
  }

  // 🔹 Atualizar registro existente
  atualizar(cpf, novoPF) {
    const lista = this.listar();
    const idx = lista.findIndex((p) => p.cpf === cpf);
    const obj = this.toPlain(novoPF);

    if (idx !== -1) {
      lista[idx] = obj;
      console.info("♻️ PF atualizada:", obj);
    } else {
      console.warn("⚠️ CPF não encontrado, adicionando novo:", cpf);
      lista.push(obj);
    }

    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  excluir(cpf) {
    const novaLista = this.listar().filter((p) => p.cpf !== cpf);
    localStorage.setItem(this.chave, JSON.stringify(novaLista));
    console.info("🗑️ PF removida:", cpf);
  }

  limpar() {
    localStorage.removeItem(this.chave);
  }
}
