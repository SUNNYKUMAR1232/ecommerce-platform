FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY main.go ./
RUN go build -o service .

FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/service ./service
CMD ["./service"]
