package com.example.demo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.fasterxml.jackson.databind.ObjectMapper;

@ServerEndpoint(value = "/echo.do")
public class WebSocketController {

	private static final List<Session> sessionList = new ArrayList<Session>();
	Map<String, String> map;
	List<PlayerVO> player = new ArrayList<>();

	@OnOpen
	public void onOpen(Session session) throws IOException {
		System.out.println("Open session id:" + session.getId());
		session.getBasicRemote().sendText("{\"name\":\"onOpen\"}");
		sessionList.add(session);
//		refreshUserList(session);
	}

	private void sendAllSessionToMessage(Session session, String message) throws IOException {
		sendAllSessionToMessage(session, message, "msg");
	}
	
	private String getUserNameBySession (Session session) {
		for(PlayerVO p: player) {
			if( p.getSession().equals(session.getId()) )
				return p.getName();
		}
		return null;
	}
	
	private void sendAllSessionToMessage(Session sessionfrom, String message, String type) throws IOException {
		Map<String, String> map = new HashMap<String, String>();
		map.put("from", getUserNameBySession (sessionfrom));
		map.put("message", message);
		map.put("type", type);
		
		ObjectMapper mapper = new ObjectMapper();
		String jsonStr = mapper.writeValueAsString(map);
		System.out.println("sendAlljsonStr:"+jsonStr);
		for (Session session : WebSocketController.sessionList) {
			session.getBasicRemote().sendText(jsonStr);
		}
		System.out.println("sendAllSessionToMessage");

	}

	@OnMessage
	public void onMessage(Session session, String message) throws IOException, EncodeException {
		System.out.println(message);
		ObjectMapper mapper = new ObjectMapper();
		String name = "";
		String msg = "";
		String type = "";
		try {
			map = mapper.readValue(message, Map.class);
			name = map.get("name");
			msg = map.get("msg");
			type = map.get("type");
		} catch (IOException e) {
		}
		
		switch(type) {
		case "register": register(session, name); System.out.println("registerIn"); break;
		case "chatting": sendAllSessionToMessage(session, msg); break;
		case "game": game(session, msg); break;
		}
		//sendAllSessionToMessage(session, message);
	}

	private void game(Session session, String message) throws IOException {
		// TODO Auto-generated method stub
		sendAllSessionToMessage(session, message, "game");
	}

	private void register(Session session, String name) throws IOException {
		//등록
		System.out.println("registerInin");
		sendAllSessionToMessage(session, name,"register");
		player.add(new PlayerVO(session.getId(), name));
		refreshUserList(session);
	}
	
	private void refreshUserList(Session session) throws IOException {
		List<String> userNames = new ArrayList<>();
		for(PlayerVO p: player) {
			userNames.add(p.getName());
		}
		sendAllSessionToMessage(session, userNames.toString(), "userList");
	}

	@OnError
	public void onError(Throwable e, Session session) {
	}

	@OnClose
	public void onClose(Session session) {
		System.out.println("Session " + session.getId() + " has ended");
		sessionList.remove(session);
	}

	// public void playerAdd(String session,String message) {
	// int idx = message.indexOf("@");
	// String name = message.substring(0,idx);
	// String msg = message.substring(idx+1);
	//
	// System.out.println("문자열분리 ===>
	// [sessionID:"+session+"][playerName:"+name+"]"+"[message:"+msg+"]");
	// List<PlayerVO> list = new ArrayList<PlayerVO>();
	// PlayerVO vo = new PlayerVO(session,name);
	// list.add(vo);
	// System.out.println("toString:"+vo.toString());
	// }
}