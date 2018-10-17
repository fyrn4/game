package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Controller
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
	
	@GetMapping("/")
	String index() {
		return "index";
	}
	
	@Bean
	public ServerEndpointExporter serverEndpointExporter() {
	  return new ServerEndpointExporter();
	}
	
	@Bean
	public WebSocketController chatServerEndpoint() {
	  return new WebSocketController();
	}	
}
