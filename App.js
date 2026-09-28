import React, { useEffect, useState } from "react";
import { View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,Modal,ScrollView,ActivityIndicator,Image} from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function App() {
  const [modalCadastro, setModalCadastro] = useState(false);

  const [marca, setMarca] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);

  const endereco = "http://10.67.57.183/AulaPAMII/grafico_carros";

  const cores = [
    "#800000",
    "#a20202",
    "#bb0b0b",
    "#be2929",
    "#c44d4d",
  ];

  async function carregarDados() {
    try {
      const resposta = await fetch(
        `${endereco}/geragraficos.php`
      );

      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        const dadosFormatados = dados.map((item, index) => ({
          name: item.marca,
          quantidade: Number(item.quantidade),
          color: cores[index % cores.length],
          legendFontColor: "#333333",
          legendFontSize: 13,
        }));

        setDadosGrafico(dadosFormatados);
      }
    } catch (erro) {
      console.log(
        "Erro ao carregar gráfico:",
        erro
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function cadastrar() {
    if (marca === "" || quantidade === "") {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos!"
      );

      return;
    }

    try {
      const resposta = await fetch(
        `${endereco}/cadastrar.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "text/plain",
          },

          body: JSON.stringify({
            marca: marca,
            quantidade: quantidade,
          }),
        }
      );

      const dados = await resposta.json();

      if (dados.sucesso) {
        Alert.alert(
          "Sucesso",
          dados.mensagem
        );

        setMarca("");
        setQuantidade("");

        setModalCadastro(false);

        carregarDados();
      } else {
        Alert.alert(
          "Erro",
          dados.mensagem
        );
      }
    } catch (erro) {
      console.log(
        "Erro:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor"
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.banner}>
        <Image
          source={require("./assets/img_joao.png")}
          style={styles.imagemBanner}
          resizeMode="cover"
        />

        <View style={styles.escurecerBanner} />

        <View style={styles.conteudoBanner}>
          <View style={styles.linhaBanner} />

          <Text style={styles.tagBanner}>
            DEMARCH AUTOMÓVEIS
          </Text>

          <Text style={styles.tituloBanner}>
            Controle de Vendas
          </Text>

          <Text style={styles.subtituloBanner}>
            Gerencie e acompanhe as
            vendas de veículos de forma
            simples e rápida.
          </Text>
        </View>
      </View>

      <View style={styles.areaConteudo}>

        <View style={styles.cabecalhoSecao}>
          <View>
            <Text style={styles.titulo}>
              Visão Geral
            </Text>

            <Text style={styles.subtitulo}>
              Distribuição das vendas
              por marca
            </Text>
          </View>

          <View style={styles.status}>
            <View style={styles.bolinhaStatus} />
          </View>
        </View>

        <View style={styles.cardGrafico}>
          <View style={styles.topoCard}>
            <View style={styles.textosCard}>
              <Text style={styles.labelCard}>
                RELATÓRIO DE VENDAS
              </Text>

              <Text style={styles.tituloGrafico}>
                Quantidade de carros vendidos
              </Text>
            </View>

            <View style={styles.iconeGrafico}>
              <Text style={styles.iconeGraficoTexto}>
                %
              </Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.areaGrafico}>
            {loading ? (
              <View style={styles.areaLoading}>
                <ActivityIndicator
                  size="large"
                  color="#b91c1c"
                />

                <Text style={styles.textoLoading}>
                  Carregando vendas...
                </Text>
              </View>
            ) : dadosGrafico.length > 0 ? (
              <PieChart
                data={dadosGrafico}
                width={280}
                height={280}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",

                  color: (opacity = 1) =>
                    `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="quantidade"
                backgroundColor="transparent"
                paddingLeft="70"
                hasLegend={false}
                absolute
              />
            ) : (
              <Text style={styles.semDados}>
                Nenhum dado encontrado.
              </Text>
            )}
          </View>

          {dadosGrafico.length > 0 && (
            <View style={styles.areaLegenda}>
              {dadosGrafico.map((item, index) => (
                <View
                  key={index}
                  style={styles.itemLegenda}
                >
                  <View
                    style={[
                      styles.corLegenda,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  <View style={styles.textoLegendaArea}>
                    <Text style={styles.nomeLegenda}>
                      {item.name}
                    </Text>

                    <Text style={styles.quantidadeLegenda}>
                      {item.quantidade} vendidos
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => setModalCadastro(true)}
          activeOpacity={0.85}
        >
          <View style={styles.circuloMais}>
            <Text style={styles.maisBotao}>
              +
            </Text>
          </View>

          <Text style={styles.textoBotao}>
            Cadastrar Venda
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalCadastro}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCadastro(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.modal}>
            <View style={styles.detalheModal} />

            <View style={styles.iconeModal}>
              <Text style={styles.iconeModalTexto}>
                +
              </Text>
            </View>

            <Text style={styles.tagModal}>
              NOVA VENDA
            </Text>

            <Text style={styles.tituloModal}>
              Cadastrar Venda
            </Text>

            <Text style={styles.descricaoModal}>
              Informe os dados abaixo
              para registrar uma nova
              venda de veículo.
            </Text>

            <Text style={styles.label}>
              Marca do carro
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Ford"
              placeholderTextColor="#9ca3af"
              value={marca}
              onChangeText={setMarca}
            />

            <Text style={styles.label}>
              Quantidade vendida
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 15"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={quantidade}
              onChangeText={setQuantidade}
            />

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={cadastrar}
              activeOpacity={0.85}
            >
              <Text style={styles.textoBotaoCadastrar}>
                Confirmar Cadastro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => setModalCadastro(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },

  conteudo: {
    flexGrow: 1,
    backgroundColor: "#f4f4f5",
    paddingBottom: 50,
  },

  banner: {
    width: "100%",
    height: 360,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#18181b",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },

  imagemBanner: {
    width: "100%",
    height: "100%",
  },

  escurecerBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },

  conteudoBanner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },

  linhaBanner: {
    width: 55,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#dc2626",
    marginBottom: 12,
  },

  tagBanner: {
    fontSize: 11,
    fontWeight: "900",
    color: "#ef4444",
    letterSpacing: 2.5,
    marginBottom: 5,
  },

  tituloBanner: {
    fontSize: 38,
    fontWeight: "900",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 5,
  },

  subtituloBanner: {
    maxWidth: 470,
    fontSize: 15,
    lineHeight: 22,
    color: "#e4e4e7",
    marginTop: 7,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  areaConteudo: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 30,
  },

  cabecalhoSecao: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18181b",
  },

  subtitulo: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 4,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
  },

  cardGrafico: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 22,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },

  topoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textosCard: {
    flex: 1,
    paddingRight: 15,
  },

  labelCard: {
    fontSize: 10,
    fontWeight: "900",
    color: "#b91c1c",
    letterSpacing: 1.8,
    marginBottom: 5,
  },

  tituloGrafico: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18181b",
  },

  iconeGrafico: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
  },

  iconeGraficoTexto: {
    color: "#ffffff",

    fontSize: 18,
    fontWeight: "900",
  },

  divisor: {
    width: "100%",
    height: 1,
    backgroundColor: "#e4e4e7",
    marginVertical: 20,
  },

  areaGrafico: {
    width: "100%",
    minHeight: 300,
    borderRadius: 18,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  areaLoading: {
    justifyContent: "center",
    alignItems: "center",
  },

  textoLoading: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#71717a",
  },

  semDados: {
    fontSize: 15,
    fontWeight: "600",
    color: "#71717a",
  },

  areaLegenda: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },

  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minWidth: 130,
  },

  corLegenda: {
    width: 11,
    height: 11,
    borderRadius: 50,
    marginRight: 8,
  },

  textoLegendaArea: {
    flexShrink: 1,
  },

  nomeLegenda: {
    fontSize: 12,
    fontWeight: "800",
    color: "#27272a",
  },

  quantidadeLegenda: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 1,
  },

  botao: {
    width: "100%",
    maxWidth: 330,
    alignSelf: "center",
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#b91c1c",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  circuloMais: {
    width: 29,
    height: 29,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  maisBotao: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 24,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(9, 9, 11, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#ffffff",
    padding: 27,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },

    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },

  detalheModal: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 5,
    backgroundColor: "#b91c1c",
  },

  iconeModal: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 12,
  },

  iconeModalTexto: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 33,
  },

  tagModal: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "900",
    color: "#09090b",
    letterSpacing: 2,
    marginBottom: 4,
  },

  tituloModal: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "900",
    color: "#18181b",
  },

  descricaoModal: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: "#71717a",
    marginTop: 7,
    marginBottom: 25,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#3f3f46",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: "#18181b",
    marginBottom: 18,
  },

  botaoCadastrar: {
    backgroundColor: "#ffff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#b91c1c",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  textoBotaoCadastrar: {
    color: "#09090b",
    fontSize: 15,
    fontWeight: "800",
  },

  botaoCancelar: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f4f4f5",
  },

  textoCancelar: {
    color: "#71717a",
    fontSize: 14,
    fontWeight: "700",
  },
});