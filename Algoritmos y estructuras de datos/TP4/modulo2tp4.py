from modulo1tp4 import *


def principal():
    opcion = -1
    linecont = 0
    fdb = 'prueba.num'

    cargado = False

    while opcion != 0:
        menu()
        try:
            opcion = int(input("Elija la opción a ejecutar: "))
        except ValueError:
            print("Por favor, ingrese un número válido.")
            continue

        if opcion == 1:
            seguir = 0

            while seguir != 1:
                seguir = int(input("Si ya posee un archivo guardado es posible que se lo reemplace.\n"
                                   "¿Seguro que desea continuar?(pulse 1 para continuar o 0 para cancelar): "))
                if seguir == 0:
                    print('Operación cancelada correctamente.\n')
                    break
            if seguir == 1:
                linecont = leer_texto(linecont)
                cargado = True

        elif opcion == 2:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                envio = cargar()
                agregarreg(envio)
                print('Arreglo cargado correctamente.')
                linecont += 1

        elif opcion == 3:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                mostrar(linecont)

        elif opcion == 4:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                buscarcp(fdb)

        elif opcion == 5:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                buscar(fdb)

        elif opcion == 6:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                cantidad = cantidad_direcciones_validas(fdb, linecont)
                print('Cantidad de envíos con dirección válida:')

                for tipo in range(7):
                    pago1 = cantidad[tipo][0]
                    pago2 = cantidad[tipo][1]
                    print('Tipo de envío ' + str(tipo) + ':')
                    print('  - Forma de pago 1: ' + str(pago1))
                    print('  - Forma de pago 2: ' + str(pago2))

        elif opcion == 7:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                cantidad = cantidad_direcciones_validas(fdb, linecont)
                tipo_envio_total, forma_pago_total = totalizar_envios(cantidad)

                for i in range(7):
                    print('Total de envios para el tipo', i, ':', tipo_envio_total[i])
                print('-' * 50)
                for i in range(2):
                    print('Total de envios para la forma de pago', i, ':', forma_pago_total[i])

        elif opcion == 8:
            if not cargado:
                print('En primer lugar debe elegir opción 1 para leer el archivo binario.')
            else:
                sacar_promedio(fdb, linecont)
    print('Fin del programa.')


if __name__ == "__main__":
    principal()
