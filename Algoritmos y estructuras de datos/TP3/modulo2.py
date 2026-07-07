from modulo1tp3 import *


def principal():
    arreglo_envio = []
    tipo_control = ""
    opcion = -1
    importe_total = []

    while opcion != 0:
        menu()
        opcion = int(input("Elija la opción a ejecutar: "))

        if opcion == 1:
            seguir = 0
            while seguir != 1:
                seguir = int(input("Si ya posee un archivo guardado es posible que se lo reemplace.\n"
                                   "¿Seguro que desea continuar?(pulse 1 para continuar o 0 para cancelar): "))
                if seguir == 0:
                    print('Operación cancelada correctamente.')
                    break
            if seguir == 1:
                tipo_control, arreglo_envio = leer_texto()

        elif opcion == 2:
            envio = cargar()
            arreglo_envio.append(envio)

        elif opcion == 3:
            arreglo_envio = ordenar_por_codigo_postal(arreglo_envio)
            mostrar(arreglo_envio)

        elif opcion == 4:
            direccion = input("Ingrese dirección a buscar: ")
            tipo_envio = int(input("Ingrese el tipo de envío de la dirección anterior: "))
            buscar(arreglo_envio, direccion, tipo_envio)

        elif opcion == 5:
            codigo_postal = input("Ingrese el codigo postal que desea buscar: ")
            buscarcp(arreglo_envio, codigo_postal)

        elif opcion == 6:
            cantidad = cantidad_direcciones_validas(arreglo_envio, tipo_control)
            print(f'Cantidad de envíos con dirección válida: \n',
                  'Tipo de envio 0: ', cantidad[0], '\n',
                  'Tipo de envio 1: ', cantidad[1], '\n',
                  'Tipo de envio 2: ', cantidad[2], '\n',
                  'Tipo de envio 3: ', cantidad[3], '\n',
                  'Tipo de envio 4: ', cantidad[4], '\n',
                  'Tipo de envio 5: ', cantidad[5], '\n',
                  'Tipo de envio 6: ', cantidad[6])

        elif opcion == 7:
            importe_total = importe_acumulado(arreglo_envio, tipo_control)
            print(f'Importes acumulados segun tipo de envio: \n',
                  'Tipo de envio 0: ', importe_total[0], '\n',
                  'Tipo de envio 1: ', importe_total[1], '\n',
                  'Tipo de envio 2: ', importe_total[2], '\n',
                  'Tipo de envio 3: ', importe_total[3], '\n',
                  'Tipo de envio 4: ', importe_total[4], '\n',
                  'Tipo de envio 5: ', importe_total[5], '\n',
                  'Tipo de envio 6: ', importe_total[6])

        elif opcion == 8:
            if not importe_total:
                print("Debe elegir opcion 7 previamente para ejecutar esta opcion.")
            else:
                mayor, indice = buscar_mayor(importe_total)
                porc = round(porcentaje(importe_total, mayor), 2)
                print('El tipo de envio con mayor importe acumulado es el', indice, 'con un importe de $', mayor,
                      '\n Dicho importe representa un porcentaje de', porc, '% sobre el total.')

        elif opcion == 9:
            prom = promedio(arreglo_envio)
            menores = cant_menor(prom, arreglo_envio)
            print('El importe final promedio es: ', prom,
                  '\n La cantidad de envios con un importe menor al promedio es: ', menores)


if __name__ == "__main__":
    principal()
