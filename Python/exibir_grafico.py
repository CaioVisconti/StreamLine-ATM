import matplotlib.pyplot as plt
import matplotlib.animation as animation
from datetime import datetime
import psutil
import time

x_data, y_data = [], []
fig, ax = plt.subplots()
line, = ax.plot(x_data, y_data, color = "red")

ax.set_xlim(0, 50)
ax.set_ylim(0, 50)
ax.set_xlabel("Tempo")
ax.set_ylabel("Percentual de CPU")
ax.set_title("Percentual de CPU pelo tempo")

def update(frame):
    x_data.append(len(x_data))
    y_data.append(psutil.cpu_percent())

    x_data_slice = x_data[-10:]
    y_data_slice = y_data[-10:]

    line.set_data(x_data_slice, y_data_slice)
    ax.set_xlim(min(x_data_slice), max(x_data_slice) + 1)
    return line,

ani = animation.FuncAnimation(fig, update, interval=500, blit=True)

plt.show()