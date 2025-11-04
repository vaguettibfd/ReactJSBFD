import PJ from "../pessoas/PJ.mjs";

export default class PJDAO{
  constructor() {
    this.chave = "pessoasJuridicas";
  }

  listar() {
    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error("Erro ao ler PJ:", e);
      return [];
    }
  }

  toPlain(pj) {
    if (!pj) return {};
    const end = pj.getEndereco?.();
    const ie = pj.getIE?.();
    const telefones = pj.getTelefones?.() || [];

    return {
      nome: pj.getNome?.(),
      email: pj.getEmail?.(),
      cnpj: pj.getCNPJ?.(),
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
      ie: ie
        ? {
            numero: ie.getNumero?.(),
            estado: ie.getEstado?.(),
            dataRegistro: ie.getDataRegistro?.(),
          }
        : {},
    };
  }

  salvar(pj) {
    const lista = this.listar();
    const obj = this.toPlain(pj);

    if (!obj.cnpj) {
      console.error("❌ CNPJ não informado, não é possível salvar PJ");
      return;
    }

    lista.push(obj);
    localStorage.setItem(this.chave, JSON.stringify(lista));
    console.info("✅ PJ salva:", obj);
  }

  atualizar(cnpj, novoPJ) {
    const lista = this.listar();
    const idx = lista.findIndex((p) => p.cnpj === cnpj);
    const obj = this.toPlain(novoPJ);

    if (idx !== -1) {
      lista[idx] = obj;
      console.info("♻️ PJ atualizada:", obj);
    } else {
      console.warn("⚠️ CNPJ não encontrado, adicionando novo:", cnpj);
      lista.push(obj);
    }

    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  excluir(cnpj) {
    const novaLista = this.listar().filter((p) => p.cnpj !== cnpj);
    localStorage.setItem(this.chave, JSON.stringify(novaLista));
    console.info("🗑️ PJ removida:", cnpj);
  }

  limpar() {
    localStorage.removeItem(this.chave);
  }
}

