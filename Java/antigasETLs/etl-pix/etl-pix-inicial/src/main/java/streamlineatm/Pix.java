package streamlineatm;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.text.DecimalFormat;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Pix {

    @JsonProperty("AnoMes")
    private Integer anoMes;

    private Integer ano;
    private Integer mes;

    @JsonProperty("PAG_PFPJ")
    private String pagante;

    @JsonProperty("REC_PFPJ")
    private String recebedor;

    @JsonProperty("PAG_REGIAO")
    private String regiaoPagante;

    @JsonProperty("PAG_IDADE")
    private String idadePagante;

    @JsonProperty("FORMAINICIACAO")
    private String formato;

    @JsonProperty("NATUREZA")
    private String natureza;

    @JsonProperty("VALOR")
    private Double valor;

    @JsonProperty("QUANTIDADE")
    private Integer quantidade;

    private String valorTotal;

    public Pix() {
    }

    public Integer getAnoMes() {
        return anoMes;
    }

    public void setAnoMes(Integer anoMes) {
        this.anoMes = anoMes;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public String getPagante() {
        return pagante;
    }

    public void setPagante(String pagante) {
        this.pagante = pagante;
    }

    public String getRecebedor() {
        return recebedor;
    }

    public void setRecebedor(String recebedor) {
        this.recebedor = recebedor;
    }

    public String getRegiaoPagante() {
        return regiaoPagante;
    }

    public void setRegiaoPagante(String regiaoPagante) {
        this.regiaoPagante = regiaoPagante;
    }

    public String getIdadePagante() {
        return idadePagante;
    }

    public void setIdadePagante(String idadePagante) {
        this.idadePagante = idadePagante;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public String getNatureza() {
        return natureza;
    }

    public void setNatureza(String natureza) {
        this.natureza = natureza;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(String valorTotal) {
        this.valorTotal = valorTotal;
    }

    @Override
    public String toString() {
        return "Pix{" +
                "ano=" + ano +
                ", mes=" + mes +
                ", pagante='" + pagante + '\'' +
                ", recebedor='" + recebedor + '\'' +
                ", regiaoPagante='" + regiaoPagante + '\'' +
                ", idadePagante='" + idadePagante + '\'' +
                ", formato='" + formato + '\'' +
                ", natureza='" + natureza + '\'' +
                ", valor='" + valor + '\'' +
                ", quantidade='" + quantidade + '\'' +
                ", valorTotal=" + valorTotal +
                '}';
    }

    public static void calcularTotal(List<Pix> listaPix){
            DecimalFormat df = new DecimalFormat("#,###.##");
        for(Pix p : listaPix){
            p.setValorTotal((df.format(p.getValor() * p.getQuantidade()).replace(",", ".")));
        }

    }

    public static void separarAnoEMes(List<Pix> listaPix) {
        for(Pix p: listaPix){
        if (p.getAnoMes() != null) {
            String str = p.getAnoMes().toString();
//            this.ano = Integer.parseInt(str.substring(0, 4));
//            this.mes = Integer.parseInt(str.substring(4, 6));
            p.setAno(Integer.parseInt(str.substring(0, 4)));
            p.setMes(Integer.parseInt(str.substring(4, 6)));
        }
        }
    }




}