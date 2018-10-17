package com.example.demo;

public class PlayerVO {
	private String session;
	private String name;
	/**
	 * @param session
	 * @param name
	 */
	PlayerVO(){}
	public PlayerVO(String session, String name) {
		this.session = session;
		this.name = name;
	}
	public String getSession() {
		return session;
	}
	public void setSession(String session) {
		this.session = session;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
//	@Override
//	public String toString() {
//		return "session:"+session+" name:"+name;
//	}
}
