FROM rasa/rasa-sdk:3.5.1
WORKDIR /app
USER root
RUN pip3 install recognizers-text-suite
RUN pip3 install requests
RUN pip3 install datetime
EXPOSE 5055
USER 1001